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
import { useTranslation } from "@/hooks/useTranslation";

const BASE_URL = process.env.EXPO_PUBLIC_AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_AI_INTEGRATIONS_ANTHROPIC_API_KEY;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are CaseBuilder AI, a helpful case organization assistant that provides AI-powered informational analysis based on the user's selected Canadian province or U.S. state.

CRITICAL RULES — always follow these without exception:
1. You provide INFORMATIONAL and ORGANIZATIONAL support only — never legal advice.
2. NEVER say "This is illegal", "You will win", "This is legal advice", or "You should legally…" in any definitive way.
3. ALWAYS use careful hedging language throughout every response:
   - "In many cases…"
   - "In many jurisdictions…"
   - "This may depend on your jurisdiction…"
   - "This can vary depending on your province or state."
   - "Typically…"
   - "You may want to consider…"
   - "You may want to verify this with a licensed lawyer in your area."
4. NEVER fabricate or invent specific law article numbers, exact legal code references, statute names, or case citations. If you are unsure of an exact rule, describe the general concept in plain language. Do not guess at specific codes or section numbers.
5. Do NOT reference made-up regulatory bodies, invented case names, or unverifiable legal standards. When referencing agencies or frameworks (e.g. Consumer Protection Ontario, DFPI, OPC), only mention well-known ones and note that laws may have changed.
6. ALWAYS tie your responses to the specific jurisdiction provided — do not give generic answers without jurisdiction context.
7. When jurisdiction-specific accuracy is uncertain, include: "This can vary depending on your province or state. This is general guidance and may vary based on local law."
8. Laws change frequently — always note that your analysis is based on the jurisdiction selected and may not reflect the most current law.
9. END every substantive response with: "This is general information, not legal advice. CaseBuilder AI is not a lawyer and does not guarantee any legal outcome."
10. If you are uncertain about something, say so explicitly rather than guessing.
11. Be warm, calm, and supportive. These users are stressed and need clear, organized guidance.
12. Help them organize their thoughts, gather evidence, and understand their situation clearly.`;

async function sendMessage(messages: { role: string; content: string }[]): Promise<string> {
  if (!BASE_URL || !API_KEY) throw new Error("AI not configured");

  const response = await fetch(`${BASE_URL}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!response.ok) throw new Error(`AI error: ${response.status}`);
  const data = await response.json();
  return data.content[0]?.text || "";
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

export default function ChatScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { activeCase, cases } = useCases();
  const currentCase = activeCase || cases[0];
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
        const jurisdictionLabel = currentCase.country === "CA"
          ? `${currentCase.province || "Canada"}, Canada`
          : `${currentCase.state || "United States"}, USA`;
        apiMessages.unshift({
          role: "user",
          content: `Context: I have a ${currentCase.disputeType} case. Jurisdiction: ${jurisdictionLabel}. Case title: "${currentCase.title}". Description: ${currentCase.description || "No description provided"}. Please tailor your responses to the laws and consumer protection frameworks applicable in ${jurisdictionLabel}.`,
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

  const QUICK_PROMPTS = [
    t("chatQuick1"),
    t("chatQuick2"),
    t("chatQuick3"),
    t("chatQuick4"),
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.navy }]}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t("chatTitle")}</Text>
          {currentCase && (
            <Text style={styles.headerSub} numberOfLines={1}>{currentCase.title}</Text>
          )}
        </View>
        <View style={[styles.statusDot, { backgroundColor: "#4ADE80" }]} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={[styles.messageList, { paddingBottom: bottomPad + 80 }]}
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

      <View style={[styles.inputRow, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: bottomPad + 10 }]}>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 12,
  },
  headerCenter: { flex: 1 },
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
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
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
});
