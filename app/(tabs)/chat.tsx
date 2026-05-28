import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { useCases } from "@/context/CaseContext";
import { useColors } from "@/hooks/useColors";
import { useSubscription } from "@/lib/revenuecat";
import { useTranslation } from "@/hooks/useTranslation";

const API_SERVER = process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://casebuilder-server.onrender.com";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

async function sendMessage(messages: { role: string; content: string }[]): Promise<string> {
  const response = await fetch(`${API_SERVER}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) throw new Error(`AI error: ${response.status}`);
  const data = await response.json() as { reply?: string };
  return data.reply || "";
}

function MessageBubble({ message }: { message: Message }) {
  const colors = useColors();
  const isUser = message.role === "user";

  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAI]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.teal }]}>
          <Feather name="cpu" size={14} color="#FFFFFF" />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.bubbleUser, { backgroundColor: colors.navy }]
            : [styles.bubbleAI, { backgroundColor: colors.card, borderColor: colors.border }],
        ]}
      >
        <Text style={[styles.bubbleText, { color: isUser ? "#FFFFFF" : colors.foreground }]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, { color: isUser ? "rgba(255,255,255,0.55)" : colors.mutedForeground }]}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
      {isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1 }]}>
          <Feather name="user" size={14} color={colors.mutedForeground} />
        </View>
      )}
    </View>
  );
}

export default function ChatTabScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { activeCase, cases } = useCases();
  const { hasAccessTo } = useSubscription();
  const currentCase = activeCase || cases[0];
  const isPremium = hasAccessTo("basic");

  const jurisdictionLabel = currentCase
    ? currentCase.country === "CA"
      ? `${currentCase.province || "Canada"}, Canada`
      : `${currentCase.state || "United States"}, USA`
    : null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: jurisdictionLabel
        ? `Hi! I'm CaseBuilder AI. I'm here to help you organize your case based on the laws and legal patterns of **${jurisdictionLabel}**.\n\nI can help you understand your situation, identify what to document, and prepare questions for a lawyer.\n\nWhat would you like help with today?\n\n*This is informational support, not legal advice.*`
        : `Hi! I'm CaseBuilder AI. I'm here to help you organize your situation, understand your options, and prepare your case.\n\nFor jurisdiction-specific analysis, make sure your case has a province or state selected.\n\nWhat would you like help with today?\n\n*This is informational support, not legal advice.*`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 49 : 56;

  const QUICK_PROMPTS = [
    t("chatQuick1"),
    t("chatQuick2"),
    t("chatQuick3"),
    t("chatQuick4"),
  ];

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const apiMessages = newMessages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role, content: m.content }));

      if (currentCase) {
        const jLabel = currentCase.country === "CA"
          ? `${currentCase.province || "Canada"}, Canada`
          : `${currentCase.state || "United States"}, USA`;
        apiMessages.unshift({
          role: "user",
          content: `Context: I have a ${currentCase.disputeType} case. Jurisdiction: ${jLabel}. Case title: "${currentCase.title}". Description: ${currentCase.description || "No description provided"}. Please tailor your responses to the laws and consumer protection frameworks applicable in ${jLabel}.`,
        });
        apiMessages.splice(1, 0, {
          role: "assistant",
          content: "I understand. I'm ready to help you with your case. What would you like to know?",
        });
      }

      const reply = await sendMessage(apiMessages);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={TAB_BAR_HEIGHT + bottomPad}
    >
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.aiDot, { backgroundColor: colors.teal }]}>
            <Feather name="cpu" size={14} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>{t("chatTitle")}</Text>
            {currentCase && (
              <Text style={styles.headerSub} numberOfLines={1}>{currentCase.title}</Text>
            )}
          </View>
        </View>
        <View style={[styles.statusDot, { backgroundColor: "#4ADE80" }]} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={[styles.messageList, { paddingBottom: bottomPad + TAB_BAR_HEIGHT + 80 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<DisclaimerBanner compact />}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {isTyping && (
        <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ActivityIndicator size="small" color={colors.teal} />
          <Text style={[styles.typingText, { color: colors.mutedForeground }]}>{t("generating")}</Text>
        </View>
      )}

      {messages.length === 1 && (
        <View style={styles.quickPrompts}>
          {QUICK_PROMPTS.map(prompt => (
            <Pressable
              key={prompt}
              onPress={() => { setInput(prompt); }}
              style={[styles.quickPromptBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.quickPromptText, { color: colors.teal }]}>{prompt}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={[styles.inputRow, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + TAB_BAR_HEIGHT + 10 }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
          placeholder={t("chatPlaceholder")}
          placeholderTextColor={colors.mutedForeground}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={1000}
          returnKeyType="default"
        />
        <Pressable
          onPress={handleSend}
          disabled={!input.trim() || isTyping}
          style={({ pressed }) => [
            styles.sendBtn,
            {
              backgroundColor: input.trim() && !isTyping ? colors.teal : colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="send" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {!isPremium && (
        <View style={[styles.lockedOverlay, { backgroundColor: colors.background }]}>
          <View style={[styles.lockedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.lockIconWrap}>
              <Feather name="lock" size={28} color="#C9A227" />
            </View>
            <Text style={[styles.lockedTitle, { color: colors.foreground }]}>AI Chat is Premium</Text>
            <Text style={[styles.lockedSub, { color: colors.mutedForeground }]}>
              Get unlimited AI legal chat, case summaries, and risk analysis for just $2.99/month.
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/paywall");
              }}
              style={({ pressed }) => [styles.lockedBtn, { opacity: pressed ? 0.85 : 1 }]}
            >
              <Feather name="award" size={16} color="#0D1F35" />
              <Text style={styles.lockedBtnText}>Unlock for $2.99/mo</Text>
            </Pressable>
            <Text style={[styles.lockedTrial, { color: colors.mutedForeground }]}>7-day free trial · Cancel anytime</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aiDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "DMSans_400Regular",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  messageList: {
    padding: 16,
    gap: 12,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
  },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAI: { justifyContent: "flex-start" },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 16,
    gap: 4,
  },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAI: {
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: "DMSans_400Regular",
    alignSelf: "flex-end",
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  typingText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    fontStyle: "italic",
  },
  quickPrompts: {
    padding: 12,
    gap: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  quickPromptBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickPromptText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Paywall overlay ── */
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  lockedCard: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  lockIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(201,162,39,0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(201,162,39,0.35)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  lockedTitle: {
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  lockedSub: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 21,
    textAlign: "center",
  },
  lockedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#C9A227",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  lockedBtnText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    color: "#0D1F35",
  },
  lockedTrial: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
});
