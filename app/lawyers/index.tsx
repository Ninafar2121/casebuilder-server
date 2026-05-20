import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useMemo } from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCases } from "@/context/CaseContext";

const NAVY = "#1B3A6B";
const TEAL = "#2E86AB";
const GOLD = "#C9A84C";
const BACKGROUND = "#F2F4F8";
const TEXT_PRIMARY = "#13233F";
const TEXT_SECONDARY = "#66758F";
const CARD = "#FFFFFF";
const BORDER = "#DCE4EF";
const SUCCESS = "#2E7D57";

const PROVINCE_FILTERS = [
  "All",
  // Canada
  "Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan",
  "Nova Scotia", "New Brunswick", "Newfoundland", "Prince Edward Island",
  // USA
  "California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania",
  "Ohio", "Georgia", "Michigan", "Washington", "Colorado", "Arizona",
  "Massachusetts", "North Carolina", "Virginia", "New Jersey", "Minnesota",
  "Oregon", "Nevada", "Wisconsin",
] as const;
type ProvinceFilter = (typeof PROVINCE_FILTERS)[number];

function getSlots(daysAhead: number[], times: string[]): string[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return daysAhead.map((d, i) => {
    const date = new Date();
    date.setDate(date.getDate() + d);
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} — ${times[i % times.length]}`;
  });
}

const ALL_CASE_TYPES = [
  "Employment", "Landlord-Tenant", "Consumer Disputes", "Contract",
  "Insurance Claims", "Human Rights", "Small Claims", "Product Liability",
] as const;

interface Lawyer {
  id: string;
  name: string;
  firm: string;
  province: ProvinceFilter;
  caseTypes: string[];
  rate: string;
  rateNote: string;
  languages: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  bio: string;
  availability: string[];
  nextAvailable: string;
  responseTime: string;
}

const LAWYERS: Lawyer[] = [
  // ── CANADA ──
  {
    id: "1",
    name: "Sarah Chen",
    firm: "Chen & Associates",
    province: "Ontario",
    caseTypes: ["Employment", "Landlord-Tenant", "Human Rights"],
    rate: "$150",
    rateNote: "per 30-min consultation",
    languages: ["English", "Mandarin"],
    verified: true,
    rating: 4.8,
    reviewCount: 124,
    phone: "+1-416-555-0192",
    email: "s.chen@chenassociates.ca",
    bio: "15+ years helping employees and tenants understand and assert their rights across Ontario.",
    availability: getSlots([1, 1, 2, 3, 4], ["10:00 AM", "2:00 PM", "11:00 AM", "3:00 PM", "9:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "2",
    name: "Marc Tremblay",
    firm: "Tremblay Droit Conseil",
    province: "Quebec",
    caseTypes: ["Consumer Disputes", "Contract", "Small Claims"],
    rate: "$120",
    rateNote: "per 30-min consultation",
    languages: ["French", "English"],
    verified: true,
    rating: 4.6,
    reviewCount: 87,
    phone: "+1-514-555-0347",
    email: "m.tremblay@tremblaylegal.ca",
    bio: "Specializes in consumer protection under Quebec's Consumer Protection Act and Civil Code.",
    availability: getSlots([2, 2, 4, 5], ["9:00 AM", "1:00 PM", "10:00 AM", "2:00 PM"]),
    nextAvailable: "In 2 days",
    responseTime: "Usually responds within 4 hours",
  },
  {
    id: "3",
    name: "David Kim",
    firm: "Pacific Legal Group",
    province: "British Columbia",
    caseTypes: ["Insurance Claims", "Contract", "Product Liability"],
    rate: "$175",
    rateNote: "per 30-min consultation",
    languages: ["English", "Korean"],
    verified: true,
    rating: 4.9,
    reviewCount: 203,
    phone: "+1-604-555-0581",
    email: "d.kim@pacificlegal.ca",
    bio: "Focused on insurance denials and contract disputes. Known for clear, no-nonsense guidance.",
    availability: getSlots([0, 2, 2, 4, 4], ["3:00 PM", "10:00 AM", "2:00 PM", "11:00 AM", "3:00 PM"]),
    nextAvailable: "Today",
    responseTime: "Usually responds within 1 hour",
  },
  {
    id: "4",
    name: "Priya Sharma",
    firm: "Sharma Law Office",
    province: "Alberta",
    caseTypes: ["Employment", "Consumer Disputes", "Small Claims"],
    rate: "$130",
    rateNote: "per 30-min consultation",
    languages: ["English", "Hindi"],
    verified: true,
    rating: 4.7,
    reviewCount: 91,
    phone: "+1-403-555-0214",
    email: "p.sharma@sharmalaw.ca",
    bio: "Passionate about helping everyday Albertans navigate employment and consumer disputes with confidence.",
    availability: getSlots([1, 3, 3, 5], ["9:00 AM", "11:00 AM", "3:00 PM", "10:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "5",
    name: "Luc Bouchard",
    firm: "Bouchard Droit",
    province: "Manitoba",
    caseTypes: ["Landlord-Tenant", "Small Claims", "Consumer Disputes"],
    rate: "$110",
    rateNote: "per 30-min consultation",
    languages: ["English", "French"],
    verified: true,
    rating: 4.5,
    reviewCount: 63,
    phone: "+1-204-555-0183",
    email: "l.bouchard@bouchardlaw.ca",
    bio: "Winnipeg-based lawyer helping Manitoba residents with tenant rights and small claims matters.",
    availability: getSlots([1, 2, 4], ["10:00 AM", "2:00 PM", "11:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 4 hours",
  },
  {
    id: "6",
    name: "Angela Fontaine",
    firm: "Fontaine Legal Services",
    province: "Saskatchewan",
    caseTypes: ["Employment", "Contract", "Human Rights"],
    rate: "$115",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.6,
    reviewCount: 54,
    phone: "+1-306-555-0294",
    email: "a.fontaine@fontainelaw.ca",
    bio: "Saskatoon employment lawyer dedicated to protecting workers' rights and resolving contract disputes.",
    availability: getSlots([0, 2, 3, 5], ["1:00 PM", "10:00 AM", "3:00 PM", "9:00 AM"]),
    nextAvailable: "Today",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "7",
    name: "Robert MacLeod",
    firm: "MacLeod Law Group",
    province: "Nova Scotia",
    caseTypes: ["Consumer Disputes", "Insurance Claims", "Small Claims"],
    rate: "$120",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.7,
    reviewCount: 48,
    phone: "+1-902-555-0317",
    email: "r.macleod@macleodlaw.ca",
    bio: "Halifax lawyer helping Nova Scotians with insurance disputes and consumer protection matters.",
    availability: getSlots([1, 3, 4], ["11:00 AM", "2:00 PM", "10:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "8",
    name: "Isabelle Leblanc",
    firm: "Leblanc Avocats",
    province: "New Brunswick",
    caseTypes: ["Landlord-Tenant", "Employment", "Small Claims"],
    rate: "$105",
    rateNote: "per 30-min consultation",
    languages: ["French", "English"],
    verified: true,
    rating: 4.5,
    reviewCount: 39,
    phone: "+1-506-555-0428",
    email: "i.leblanc@leblanclaw.ca",
    bio: "Bilingual New Brunswick lawyer helping tenants and employees understand and enforce their rights.",
    availability: getSlots([2, 2, 5], ["9:00 AM", "3:00 PM", "11:00 AM"]),
    nextAvailable: "In 2 days",
    responseTime: "Usually responds within 4 hours",
  },
  {
    id: "9",
    name: "Thomas Walsh",
    firm: "Walsh & Associates",
    province: "Newfoundland",
    caseTypes: ["Consumer Disputes", "Contract", "Insurance Claims"],
    rate: "$110",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.6,
    reviewCount: 31,
    phone: "+1-709-555-0539",
    email: "t.walsh@walshlaw.ca",
    bio: "St. John's attorney with a focus on consumer rights and insurance claim disputes in Newfoundland.",
    availability: getSlots([1, 3, 5], ["10:00 AM", "1:00 PM", "9:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "10",
    name: "Catherine Murphy",
    firm: "Murphy Law PEI",
    province: "Prince Edward Island",
    caseTypes: ["Small Claims", "Landlord-Tenant", "Consumer Disputes"],
    rate: "$100",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.4,
    reviewCount: 22,
    phone: "+1-902-555-0641",
    email: "c.murphy@murphylawpei.ca",
    bio: "Charlottetown lawyer providing accessible legal guidance for everyday disputes across Prince Edward Island.",
    availability: getSlots([2, 4], ["11:00 AM", "2:00 PM"]),
    nextAvailable: "In 2 days",
    responseTime: "Usually responds within 5 hours",
  },

  // ── USA ──
  {
    id: "11",
    name: "Jessica Martinez",
    firm: "Martinez Legal Group",
    province: "California",
    caseTypes: ["Employment", "Consumer Disputes", "Insurance Claims"],
    rate: "$200",
    rateNote: "per 30-min consultation",
    languages: ["English", "Spanish"],
    verified: true,
    rating: 4.8,
    reviewCount: 167,
    phone: "+1-213-555-0391",
    email: "j.martinez@martinezlegal.com",
    bio: "California employment and consumer protection attorney with 12 years fighting for workers' rights.",
    availability: getSlots([1, 2, 2, 4], ["10:00 AM", "9:00 AM", "2:00 PM", "11:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "12",
    name: "James Okafor",
    firm: "Okafor & Partners",
    province: "New York",
    caseTypes: ["Landlord-Tenant", "Contract", "Small Claims"],
    rate: "$220",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.7,
    reviewCount: 145,
    phone: "+1-212-555-0472",
    email: "j.okafor@okaforpartners.com",
    bio: "NYC tenant rights and contract disputes attorney. Helping New Yorkers hold landlords and businesses accountable.",
    availability: getSlots([0, 1, 3, 3], ["4:00 PM", "11:00 AM", "10:00 AM", "3:00 PM"]),
    nextAvailable: "Today",
    responseTime: "Usually responds within 1 hour",
  },
  {
    id: "13",
    name: "Amanda Torres",
    firm: "Torres Law PLLC",
    province: "Texas",
    caseTypes: ["Insurance Claims", "Product Liability", "Contract"],
    rate: "$180",
    rateNote: "per 30-min consultation",
    languages: ["English", "Spanish"],
    verified: true,
    rating: 4.6,
    reviewCount: 112,
    phone: "+1-713-555-0538",
    email: "a.torres@torreslaw.com",
    bio: "Texas-based attorney specializing in insurance bad faith claims and product liability cases.",
    availability: getSlots([2, 2, 4, 5], ["9:00 AM", "1:00 PM", "2:00 PM", "10:00 AM"]),
    nextAvailable: "In 2 days",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "14",
    name: "Marcus Williams",
    firm: "Williams Consumer Law",
    province: "Florida",
    caseTypes: ["Consumer Disputes", "Insurance Claims", "Contract"],
    rate: "$175",
    rateNote: "per 30-min consultation",
    languages: ["English", "Spanish"],
    verified: true,
    rating: 4.7,
    reviewCount: 138,
    phone: "+1-305-555-0619",
    email: "m.williams@williamsconsumerlaw.com",
    bio: "Miami attorney helping Florida consumers fight back against insurance companies and deceptive businesses.",
    availability: getSlots([0, 1, 3, 4], ["2:00 PM", "10:00 AM", "11:00 AM", "3:00 PM"]),
    nextAvailable: "Today",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "15",
    name: "Diana Park",
    firm: "Park Legal Chicago",
    province: "Illinois",
    caseTypes: ["Employment", "Human Rights", "Consumer Disputes"],
    rate: "$190",
    rateNote: "per 30-min consultation",
    languages: ["English", "Korean"],
    verified: true,
    rating: 4.8,
    reviewCount: 99,
    phone: "+1-312-555-0724",
    email: "d.park@parklegalchicago.com",
    bio: "Chicago employment discrimination and human rights attorney passionate about workplace justice.",
    availability: getSlots([1, 1, 3, 5], ["9:00 AM", "3:00 PM", "2:00 PM", "10:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "16",
    name: "Kevin O'Brien",
    firm: "O'Brien Law Associates",
    province: "Pennsylvania",
    caseTypes: ["Insurance Claims", "Product Liability", "Small Claims"],
    rate: "$170",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.6,
    reviewCount: 84,
    phone: "+1-215-555-0835",
    email: "k.obrien@obrienlaw.com",
    bio: "Philadelphia attorney with 10 years handling insurance disputes and product liability claims.",
    availability: getSlots([2, 3, 4], ["10:00 AM", "1:00 PM", "11:00 AM"]),
    nextAvailable: "In 2 days",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "17",
    name: "Natalie Johnson",
    firm: "Johnson Employment Law",
    province: "Georgia",
    caseTypes: ["Employment", "Human Rights", "Contract"],
    rate: "$160",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.7,
    reviewCount: 76,
    phone: "+1-404-555-0946",
    email: "n.johnson@johnsonemployment.com",
    bio: "Atlanta employment attorney helping Georgia workers with discrimination, wrongful termination, and wage disputes.",
    availability: getSlots([1, 2, 4, 4], ["11:00 AM", "2:00 PM", "9:00 AM", "3:00 PM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "18",
    name: "Brian Carter",
    firm: "Carter & Associates",
    province: "Ohio",
    caseTypes: ["Consumer Disputes", "Landlord-Tenant", "Small Claims"],
    rate: "$150",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.5,
    reviewCount: 67,
    phone: "+1-614-555-0157",
    email: "b.carter@carterlegal.com",
    bio: "Columbus consumer rights lawyer helping Ohio residents resolve disputes with businesses and landlords.",
    availability: getSlots([0, 2, 3], ["3:00 PM", "10:00 AM", "2:00 PM"]),
    nextAvailable: "Today",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "19",
    name: "Rachel Thompson",
    firm: "Thompson Law Group",
    province: "Michigan",
    caseTypes: ["Employment", "Insurance Claims", "Contract"],
    rate: "$155",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.6,
    reviewCount: 58,
    phone: "+1-313-555-0268",
    email: "r.thompson@thompsonlawmi.com",
    bio: "Detroit attorney with extensive experience in employment disputes and insurance claim denials.",
    availability: getSlots([1, 3, 5], ["10:00 AM", "1:00 PM", "11:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "20",
    name: "Sophia Nguyen",
    firm: "Nguyen Legal Seattle",
    province: "Washington",
    caseTypes: ["Consumer Disputes", "Employment", "Small Claims"],
    rate: "$195",
    rateNote: "per 30-min consultation",
    languages: ["English", "Vietnamese"],
    verified: true,
    rating: 4.8,
    reviewCount: 121,
    phone: "+1-206-555-0379",
    email: "s.nguyen@nguyenlegal.com",
    bio: "Seattle consumer protection attorney helping Washington residents stand up to corporations and unfair employers.",
    availability: getSlots([0, 1, 2, 4], ["11:00 AM", "3:00 PM", "10:00 AM", "2:00 PM"]),
    nextAvailable: "Today",
    responseTime: "Usually responds within 1 hour",
  },
  {
    id: "21",
    name: "Tyler Brooks",
    firm: "Brooks Law Denver",
    province: "Colorado",
    caseTypes: ["Landlord-Tenant", "Consumer Disputes", "Contract"],
    rate: "$165",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.6,
    reviewCount: 73,
    phone: "+1-720-555-0481",
    email: "t.brooks@brookslawdenver.com",
    bio: "Denver tenant rights and consumer law attorney helping Coloradans navigate disputes with confidence.",
    availability: getSlots([1, 2, 3, 5], ["9:00 AM", "2:00 PM", "11:00 AM", "10:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "22",
    name: "Maria Reyes",
    firm: "Reyes Legal Phoenix",
    province: "Arizona",
    caseTypes: ["Insurance Claims", "Consumer Disputes", "Small Claims"],
    rate: "$155",
    rateNote: "per 30-min consultation",
    languages: ["English", "Spanish"],
    verified: true,
    rating: 4.5,
    reviewCount: 61,
    phone: "+1-602-555-0592",
    email: "m.reyes@reyeslegal.com",
    bio: "Phoenix consumer attorney helping Arizona residents fight insurance denials and deceptive business practices.",
    availability: getSlots([2, 3, 4], ["10:00 AM", "3:00 PM", "1:00 PM"]),
    nextAvailable: "In 2 days",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "23",
    name: "Emily Foster",
    firm: "Foster & Cole LLP",
    province: "Massachusetts",
    caseTypes: ["Employment", "Human Rights", "Contract"],
    rate: "$210",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.9,
    reviewCount: 156,
    phone: "+1-617-555-0603",
    email: "e.foster@fostercole.com",
    bio: "Boston employment and civil rights attorney with a track record of holding employers accountable.",
    availability: getSlots([1, 1, 3, 4], ["10:00 AM", "2:00 PM", "11:00 AM", "3:00 PM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "24",
    name: "Derek Hall",
    firm: "Hall Law NC",
    province: "North Carolina",
    caseTypes: ["Consumer Disputes", "Landlord-Tenant", "Employment"],
    rate: "$145",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.5,
    reviewCount: 52,
    phone: "+1-704-555-0714",
    email: "d.hall@halllawnc.com",
    bio: "Charlotte attorney helping North Carolina residents with employment disputes and tenant rights issues.",
    availability: getSlots([0, 2, 4], ["2:00 PM", "11:00 AM", "10:00 AM"]),
    nextAvailable: "Today",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "25",
    name: "Lauren Mitchell",
    firm: "Mitchell Legal VA",
    province: "Virginia",
    caseTypes: ["Employment", "Contract", "Consumer Disputes"],
    rate: "$175",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.7,
    reviewCount: 88,
    phone: "+1-571-555-0825",
    email: "l.mitchell@mitchelllegalva.com",
    bio: "Northern Virginia employment and contract attorney serving DC-area clients with personalized legal guidance.",
    availability: getSlots([1, 2, 3, 5], ["9:00 AM", "1:00 PM", "3:00 PM", "11:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "26",
    name: "Andrew Cohen",
    firm: "Cohen Consumer Law NJ",
    province: "New Jersey",
    caseTypes: ["Consumer Disputes", "Insurance Claims", "Small Claims"],
    rate: "$185",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.6,
    reviewCount: 79,
    phone: "+1-973-555-0936",
    email: "a.cohen@cohenconsumer.com",
    bio: "New Jersey consumer protection attorney experienced in insurance disputes and product liability claims.",
    availability: getSlots([1, 3, 3, 4], ["10:00 AM", "9:00 AM", "2:00 PM", "11:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "27",
    name: "Aisha Patel",
    firm: "Patel Law Minneapolis",
    province: "Minnesota",
    caseTypes: ["Human Rights", "Employment", "Consumer Disputes"],
    rate: "$160",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.7,
    reviewCount: 65,
    phone: "+1-612-555-0147",
    email: "a.patel@patellawmn.com",
    bio: "Minneapolis civil rights and employment attorney fighting discrimination and workplace injustice in Minnesota.",
    availability: getSlots([2, 2, 4], ["11:00 AM", "3:00 PM", "10:00 AM"]),
    nextAvailable: "In 2 days",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "28",
    name: "Chris Andersen",
    firm: "Andersen Legal Portland",
    province: "Oregon",
    caseTypes: ["Landlord-Tenant", "Consumer Disputes", "Small Claims"],
    rate: "$170",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.6,
    reviewCount: 57,
    phone: "+1-503-555-0258",
    email: "c.andersen@andersenlegal.com",
    bio: "Portland tenant rights attorney helping Oregon renters fight illegal evictions and unsafe housing conditions.",
    availability: getSlots([0, 1, 3], ["3:00 PM", "10:00 AM", "2:00 PM"]),
    nextAvailable: "Today",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: "29",
    name: "Vanessa Cruz",
    firm: "Cruz Law Las Vegas",
    province: "Nevada",
    caseTypes: ["Consumer Disputes", "Contract", "Insurance Claims"],
    rate: "$165",
    rateNote: "per 30-min consultation",
    languages: ["English", "Spanish"],
    verified: true,
    rating: 4.5,
    reviewCount: 43,
    phone: "+1-702-555-0369",
    email: "v.cruz@cruzlawlv.com",
    bio: "Las Vegas consumer and contract attorney helping Nevada residents resolve business and insurance disputes.",
    availability: getSlots([1, 3, 5], ["11:00 AM", "2:00 PM", "9:00 AM"]),
    nextAvailable: "Tomorrow",
    responseTime: "Usually responds within 3 hours",
  },
  {
    id: "30",
    name: "Nathan Reed",
    firm: "Reed Employment Law WI",
    province: "Wisconsin",
    caseTypes: ["Employment", "Human Rights", "Contract"],
    rate: "$145",
    rateNote: "per 30-min consultation",
    languages: ["English"],
    verified: true,
    rating: 4.5,
    reviewCount: 49,
    phone: "+1-414-555-0471",
    email: "n.reed@reedlawwi.com",
    bio: "Milwaukee employment attorney dedicated to protecting Wisconsin workers from unfair treatment and wage theft.",
    availability: getSlots([2, 4, 4], ["10:00 AM", "9:00 AM", "3:00 PM"]),
    nextAvailable: "In 2 days",
    responseTime: "Usually responds within 3 hours",
  },
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= full ? "star" : i === full + 1 && half ? "star-half" : "star-outline"}
          size={13}
          color={GOLD}
        />
      ))}
    </View>
  );
}

interface BookingModalProps {
  lawyer: Lawyer | null;
  caseSummary: string;
  onClose: () => void;
}

function BookingModal({ lawyer, caseSummary, onClose }: BookingModalProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2 | "confirmed">(1);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [shareSummary, setShareSummary] = useState(true);
  const [note, setNote] = useState("");

  if (!lawyer) return null;

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const summarySection = shareSummary && caseSummary
      ? `\n\nCase Summary:\n${caseSummary}`
      : "";
    const noteSection = note.trim() ? `\n\nNote from client:\n${note.trim()}` : "";
    const subject = encodeURIComponent(`CaseBuilder — Consultation Request for ${selectedSlot}`);
    const body = encodeURIComponent(
      `Hi ${lawyer.name.split(" ")[0]},\n\nI'd like to book a consultation for: ${selectedSlot}${summarySection}${noteSection}\n\nThank you`
    );
    Linking.openURL(`mailto:${lawyer.email}?subject=${subject}&body=${body}`);
    setStep("confirmed");
  };

  const handleClose = () => {
    setStep(1);
    setSelectedSlot("");
    setShareSummary(true);
    setNote("");
    onClose();
  };

  return (
    <Modal
      visible={!!lawyer}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.modalRoot, { backgroundColor: BACKGROUND }]}>
        {step !== "confirmed" && (
          <View style={[styles.modalHeader, { paddingTop: insets.top > 0 ? insets.top + 8 : 20 }]}>
            <Pressable
              onPress={step === 1 ? handleClose : () => setStep(1)}
              style={({ pressed }) => [styles.modalBackBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name={step === 1 ? "close" : "arrow-back"} size={20} color={TEXT_PRIMARY} />
            </Pressable>
            <Text style={styles.modalHeaderTitle}>
              {step === 1 ? "Select a Time" : "Confirm Booking"}
            </Text>
            <View style={styles.modalStepPips}>
              {[1, 2].map(s => (
                <View
                  key={s}
                  style={[
                    styles.stepPip,
                    { backgroundColor: step >= s ? NAVY : BORDER, width: step === s ? 20 : 8 },
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={[styles.modalContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && (
            <>
              <View style={styles.modalLawyerRow}>
                <View style={styles.modalAvatar}>
                  <Text style={styles.modalAvatarText}>{lawyer.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalLawyerName}>{lawyer.name}</Text>
                  <Text style={styles.modalLawyerFirm}>{lawyer.firm}</Text>
                  <View style={styles.modalRateRow}>
                    <Ionicons name="cash-outline" size={12} color={TEXT_SECONDARY} />
                    <Text style={styles.modalRateText}>{lawyer.rate} {lawyer.rateNote}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionLabel}>AVAILABLE SLOTS</Text>
                <Text style={styles.modalSectionSub}>
                  {lawyer.responseTime}
                </Text>
                <View style={styles.slotsGrid}>
                  {lawyer.availability.map(slot => (
                    <Pressable
                      key={slot}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedSlot(slot);
                      }}
                      style={[
                        styles.slotChip,
                        selectedSlot === slot && styles.slotChipSelected,
                      ]}
                    >
                      <Ionicons
                        name="time-outline"
                        size={13}
                        color={selectedSlot === slot ? "#FFFFFF" : TEXT_SECONDARY}
                      />
                      <Text style={[
                        styles.slotText,
                        selectedSlot === slot && styles.slotTextSelected,
                      ]}>
                        {slot}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={[styles.infoBox, { borderColor: TEAL + "30", backgroundColor: TEAL + "08" }]}>
                <Ionicons name="information-circle-outline" size={14} color={TEAL} />
                <Text style={[styles.infoBoxText, { color: TEAL }]}>
                  Booking sends an email request directly to {lawyer.name.split(" ")[0]}. They will confirm the appointment with you.
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  if (!selectedSlot) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    return;
                  }
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setStep(2);
                }}
                style={({ pressed }) => [
                  styles.modalCta,
                  { backgroundColor: selectedSlot ? NAVY : BORDER, opacity: pressed ? 0.88 : 1 },
                ]}
              >
                <Text style={[styles.modalCtaText, { color: selectedSlot ? "#FFFFFF" : TEXT_SECONDARY }]}>
                  {selectedSlot ? "Continue →" : "Select a time slot first"}
                </Text>
              </Pressable>
            </>
          )}

          {step === 2 && (
            <>
              <View style={[styles.confirmSlotCard, { backgroundColor: CARD, borderColor: BORDER }]}>
                <View style={[styles.confirmSlotIconWrap, { backgroundColor: NAVY + "12" }]}>
                  <Ionicons name="calendar-outline" size={20} color={NAVY} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.confirmSlotLabel}>Selected Time</Text>
                  <Text style={styles.confirmSlotValue}>{selectedSlot}</Text>
                  <Text style={styles.confirmSlotLawyer}>{lawyer.name} · {lawyer.firm}</Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionLabel}>SHARE CASE SUMMARY</Text>
                <Text style={styles.modalSectionSub}>
                  Send your case summary with the request so {lawyer.name.split(" ")[0]} can review it before your consultation.
                </Text>

                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync();
                    setShareSummary(!shareSummary);
                  }}
                  style={[
                    styles.shareToggle,
                    {
                      backgroundColor: shareSummary ? TEAL + "10" : CARD,
                      borderColor: shareSummary ? TEAL + "40" : BORDER,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.shareToggleTitle, { color: shareSummary ? TEAL : TEXT_PRIMARY }]}>
                      {shareSummary ? "✓  Case summary will be shared" : "Case summary — tap to share"}
                    </Text>
                    {caseSummary ? (
                      <Text style={styles.shareToggleSub} numberOfLines={2}>{caseSummary}</Text>
                    ) : (
                      <Text style={styles.shareToggleSub}>No case created yet — this section will be empty</Text>
                    )}
                  </View>
                  <Ionicons
                    name={shareSummary ? "checkbox" : "square-outline"}
                    size={22}
                    color={shareSummary ? TEAL : BORDER}
                  />
                </Pressable>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionLabel}>ADD A NOTE (OPTIONAL)</Text>
                <TextInput
                  style={[styles.noteInput, { backgroundColor: CARD, borderColor: BORDER }]}
                  placeholder="E.g. I'm specifically concerned about the timeline limitation and would like advice on next steps."
                  placeholderTextColor={TEXT_SECONDARY}
                  value={note}
                  onChangeText={setNote}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={[styles.infoBox, { borderColor: GOLD + "40", backgroundColor: GOLD + "08" }]}>
                <Ionicons name="shield-checkmark-outline" size={14} color={GOLD} />
                <Text style={[styles.infoBoxText, { color: "#8A6A1A" }]}>
                  Your information is only shared with {lawyer.name.split(" ")[0]} and is not stored by CaseBuilder.
                </Text>
              </View>

              <Pressable
                onPress={handleConfirm}
                style={({ pressed }) => [
                  styles.modalCta,
                  { backgroundColor: TEAL, opacity: pressed ? 0.88 : 1 },
                ]}
              >
                <Ionicons name="send-outline" size={16} color="#FFFFFF" />
                <Text style={styles.modalCtaText}>Send Booking Request</Text>
              </Pressable>
            </>
          )}

          {step === "confirmed" && (
            <View style={styles.confirmationWrap}>
              <View style={[styles.confirmationIcon, { backgroundColor: SUCCESS + "15", borderColor: SUCCESS + "30" }]}>
                <Ionicons name="checkmark-circle" size={52} color={SUCCESS} />
              </View>
              <Text style={styles.confirmationTitle}>Request Sent!</Text>
              <Text style={styles.confirmationSub}>
                Your booking request for {selectedSlot} has been sent to {lawyer.name}. They'll confirm your appointment by email.
              </Text>

              <View style={[styles.confirmationCard, { backgroundColor: CARD, borderColor: BORDER }]}>
                <Text style={styles.confirmationCardLabel}>WHAT HAPPENS NEXT</Text>
                {[
                  `${lawyer.name.split(" ")[0]} reviews your request and case summary`,
                  "They confirm the time or suggest an alternative",
                  "You get a consultation link or phone call details by email",
                ].map((step, i) => (
                  <View key={i} style={styles.confirmationStep}>
                    <View style={[styles.confirmationStepNum, { backgroundColor: NAVY }]}>
                      <Text style={styles.confirmationStepNumText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.confirmationStepText}>{step}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.modalCta,
                  { backgroundColor: NAVY, opacity: pressed ? 0.88 : 1 },
                ]}
              >
                <Text style={styles.modalCtaText}>Done</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

function LawyerCard({
  lawyer,
  onBook,
}: {
  lawyer: Lawyer;
  onBook: (l: Lawyer) => void;
}) {
  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${lawyer.phone}`);
  };

  const handleEmail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(
      `mailto:${lawyer.email}?subject=CaseBuilder%20%E2%80%94%20Case%20Summary%20Request`
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarInitial}>{lawyer.name.charAt(0)}</Text>
        </View>

        <View style={styles.cardHeaderInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.lawyerName} numberOfLines={1}>{lawyer.name}</Text>
            {lawyer.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={13} color={TEAL} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.firmName} numberOfLines={1}>{lawyer.firm}</Text>

          <View style={styles.ratingRow}>
            <StarRating rating={lawyer.rating} />
            <Text style={styles.ratingNum}>{lawyer.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({lawyer.reviewCount})</Text>
          </View>
        </View>
      </View>

      <Text style={styles.bio} numberOfLines={3}>{lawyer.bio}</Text>

      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={13} color={TEXT_SECONDARY} />
          <Text style={styles.metaText}>{lawyer.province}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="cash-outline" size={13} color={TEXT_SECONDARY} />
          <Text style={styles.metaText}>{lawyer.rate} · {lawyer.rateNote}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="chatbubble-ellipses-outline" size={13} color={TEXT_SECONDARY} />
          <Text style={styles.metaText}>{lawyer.languages.join(" · ")}</Text>
        </View>
      </View>

      <View style={styles.caseTypesRow}>
        {lawyer.caseTypes.map(ct => (
          <View key={ct} style={styles.caseTypeChip}>
            <Text style={styles.caseTypeText}>{ct}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.availabilityRow, { backgroundColor: SUCCESS + "10", borderColor: SUCCESS + "25" }]}>
        <Ionicons name="calendar-outline" size={13} color={SUCCESS} />
        <Text style={[styles.availabilityText, { color: SUCCESS }]}>
          Next available: <Text style={{ fontFamily: "DMSans_600SemiBold" }}>{lawyer.nextAvailable}</Text>
        </Text>
      </View>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onBook(lawyer);
        }}
        style={({ pressed }) => [styles.bookBtn, { opacity: pressed ? 0.87 : 1 }]}
      >
        <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
        <Text style={styles.bookBtnText}>Book a Consultation</Text>
      </Pressable>

      <View style={styles.secondaryActions}>
        <Pressable
          onPress={handleCall}
          style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Ionicons name="call-outline" size={15} color={TEAL} />
          <Text style={[styles.secondaryBtnText, { color: TEAL }]}>Call</Text>
        </Pressable>
        <View style={styles.secondaryDivider} />
        <Pressable
          onPress={handleEmail}
          style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Ionicons name="mail-outline" size={15} color={NAVY} />
          <Text style={[styles.secondaryBtnText, { color: NAVY }]}>Email</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function LawyerFinderScreen() {
  const insets = useSafeAreaInsets();
  const { cases, activeCase } = useCases();
  const [activeProvince, setActiveProvince] = useState<ProvinceFilter>("All");
  const [activeCaseType, setActiveCaseType] = useState("");
  const [search, setSearch] = useState("");
  const [bookingLawyer, setBookingLawyer] = useState<Lawyer | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const caseSummary = useMemo(() => {
    const c = activeCase || (cases.length > 0 ? cases[0] : null);
    if (!c) return "";
    return [
      `Case: ${c.title}`,
      c.disputeType ? `Type: ${c.disputeType}` : null,
      c.jurisdictionDisplayName ? `Jurisdiction: ${c.jurisdictionDisplayName}` : null,
      c.description ? `Summary: ${c.description.slice(0, 200)}${c.description.length > 200 ? "…" : ""}` : null,
    ].filter(Boolean).join("\n");
  }, [activeCase, cases]);

  const filtered = useMemo(() => {
    return LAWYERS.filter(l => {
      const matchProvince = activeProvince === "All" || l.province === activeProvince;
      const matchCaseType = !activeCaseType || l.caseTypes.some(ct =>
        ct.toLowerCase().includes(activeCaseType.toLowerCase())
      );
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        l.name.toLowerCase().includes(q) ||
        l.firm.toLowerCase().includes(q) ||
        l.caseTypes.some(ct => ct.toLowerCase().includes(q)) ||
        l.province.toLowerCase().includes(q);
      return matchProvince && matchCaseType && matchSearch;
    });
  }, [activeProvince, activeCaseType, search]);

  const handleApplyToJoin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(
      "mailto:lawyers@casebuilder.ai?subject=Apply%20to%20Join%20CaseBuilder%20Lawyer%20Directory"
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <LinearGradient
          colors={["#112650", NAVY, "#24508A"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.headerContent}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerTextWrap}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Lawyer Finder</Text>
            </View>
            <Text style={styles.headerSub}>
              Connect with lawyers who handle your type of dispute, in your province.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={17} color={TEXT_SECONDARY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, case type, or province…"
            placeholderTextColor={TEXT_SECONDARY}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {search.length > 0 && Platform.OS !== "ios" && (
            <Pressable onPress={() => setSearch("")} style={styles.searchClear}>
              <Ionicons name="close-circle" size={17} color={TEXT_SECONDARY} />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {PROVINCE_FILTERS.map(f => (
            <Pressable
              key={f}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveProvince(f);
              }}
              style={[styles.filterChip, activeProvince === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, activeProvince === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {ALL_CASE_TYPES.map(ct => (
            <Pressable
              key={ct}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveCaseType(activeCaseType === ct ? "" : ct);
              }}
              style={[
                styles.filterChip,
                styles.filterChipSmall,
                activeCaseType === ct && styles.filterChipCaseTypeActive,
              ]}
            >
              <Text style={[
                styles.filterChipText,
                styles.filterChipTextSmall,
                activeCaseType === ct && styles.filterChipTextActive,
              ]}>
                {ct}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={44} color={TEXT_SECONDARY} />
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptyBody}>
              Try adjusting your filters or search term.
            </Text>
            <Pressable
              onPress={() => { setSearch(""); setActiveProvince("All"); setActiveCaseType(""); }}
              style={styles.emptyResetBtn}
            >
              <Text style={styles.emptyResetText}>Clear all filters</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.listWrap}>
            <Text style={styles.resultsCount}>
              {filtered.length} lawyer{filtered.length !== 1 ? "s" : ""} found
            </Text>
            {filtered.map(lawyer => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} onBook={setBookingLawyer} />
            ))}
          </View>
        )}

        <View style={styles.applySection}>
          <View style={styles.applyIconWrap}>
            <Ionicons name="briefcase-outline" size={28} color={TEAL} />
          </View>
          <Text style={styles.applyTitle}>Are you a lawyer?</Text>
          <Text style={styles.applySub}>
            Join our directory and connect with people who need your expertise. We list lawyers across Canada and the United States.
          </Text>
          <Pressable
            onPress={handleApplyToJoin}
            style={({ pressed }) => [styles.applyBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Ionicons name="send-outline" size={16} color="#FFFFFF" />
            <Text style={styles.applyBtnText}>Apply to Join</Text>
          </Pressable>
        </View>

        <View style={styles.disclaimerWrap}>
          <Ionicons name="information-circle-outline" size={14} color={TEXT_SECONDARY} />
          <Text style={styles.disclaimerText}>
            CaseBuilder does not endorse any listed lawyer. For informational purposes only.
          </Text>
        </View>
      </ScrollView>

      <BookingModal
        lawyer={bookingLawyer}
        caseSummary={caseSummary}
        onClose={() => setBookingLawyer(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    flexShrink: 0,
  },
  headerTextWrap: {
    flex: 1,
    gap: 6,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  betaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "rgba(212,175,55,0.18)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.45)",
  },
  betaBadgeText: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    color: "#E1BE54",
    letterSpacing: 0.8,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.78)",
    lineHeight: 21,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, gap: 12 },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    height: 46,
    gap: 8,
  },
  searchIcon: { flexShrink: 0 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: TEXT_PRIMARY,
    height: "100%",
  },
  searchClear: { padding: 2 },

  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  filterChipSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterChipActive: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  filterChipCaseTypeActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    color: TEXT_SECONDARY,
  },
  filterChipTextSmall: {
    fontSize: 12,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },

  resultsCount: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    color: TEXT_SECONDARY,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  listWrap: {
    paddingHorizontal: 20,
    gap: 16,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#1A2B40",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: NAVY + "14",
    borderWidth: 1.5,
    borderColor: NAVY + "25",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarInitial: {
    fontSize: 22,
    fontFamily: "Raleway_700Bold",
    color: NAVY,
  },
  cardHeaderInfo: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  lawyerName: {
    fontSize: 16,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: TEAL + "12",
    borderWidth: 1,
    borderColor: TEAL + "30",
  },
  verifiedText: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    color: TEAL,
  },
  firmName: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: TEXT_SECONDARY,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  starRow: {
    flexDirection: "row",
    gap: 1,
  },
  ratingNum: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: TEXT_PRIMARY,
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
  },
  bio: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    lineHeight: 19,
  },
  metaGrid: { gap: 6 },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: TEXT_SECONDARY,
  },
  caseTypesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  caseTypeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: BACKGROUND,
    borderWidth: 1,
    borderColor: BORDER,
  },
  caseTypeText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    color: TEXT_SECONDARY,
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: NAVY,
    paddingVertical: 13,
    borderRadius: 14,
  },
  bookBtnText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
  secondaryActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  secondaryDivider: {
    width: 1,
    height: 18,
    backgroundColor: BORDER,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyResetBtn: {
    marginTop: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: NAVY + "12",
    borderWidth: 1,
    borderColor: NAVY + "25",
  },
  emptyResetText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    color: NAVY,
  },

  applySection: {
    marginHorizontal: 20,
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: TEAL + "30",
    shadowColor: "#1A2B40",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  applyIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: TEAL + "12",
    borderWidth: 1,
    borderColor: TEAL + "25",
    alignItems: "center",
    justifyContent: "center",
  },
  applyTitle: {
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  applySub: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 19,
  },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: NAVY,
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 4,
  },
  applyBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },

  disclaimerWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  disclaimerText: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    flex: 1,
    lineHeight: 16,
  },

  /* ── Booking Modal ── */
  modalRoot: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  modalHeaderTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  modalStepPips: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  stepPip: {
    height: 6,
    borderRadius: 3,
  },
  modalScroll: { flex: 1 },
  modalContent: {
    padding: 20,
    gap: 20,
  },
  modalLawyerRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: NAVY + "14",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  modalAvatarText: {
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    color: NAVY,
  },
  modalLawyerName: {
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
  },
  modalLawyerFirm: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: TEXT_SECONDARY,
  },
  modalRateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  modalRateText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    color: TEXT_SECONDARY,
  },
  modalSection: { gap: 10 },
  modalSectionLabel: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    color: TEXT_SECONDARY,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  modalSectionSub: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    lineHeight: 19,
    marginTop: -4,
  },
  slotsGrid: {
    gap: 8,
  },
  slotChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  slotChipSelected: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  slotText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: TEXT_SECONDARY,
  },
  slotTextSelected: {
    color: "#FFFFFF",
    fontFamily: "DMSans_600SemiBold",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoBoxText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    flex: 1,
    lineHeight: 18,
  },
  modalCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
  },
  modalCtaText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
  confirmSlotCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  confirmSlotIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  confirmSlotLabel: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    color: TEXT_SECONDARY,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  confirmSlotValue: {
    fontSize: 15,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  confirmSlotLawyer: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
  },
  shareToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  shareToggleTitle: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 3,
  },
  shareToggleSub: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    lineHeight: 17,
  },
  noteInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 13,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: TEXT_PRIMARY,
    minHeight: 100,
  },
  confirmationWrap: {
    alignItems: "center",
    paddingTop: 20,
    gap: 16,
  },
  confirmationIcon: {
    width: 90,
    height: 90,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  confirmationTitle: {
    fontSize: 28,
    fontFamily: "Raleway_700Bold",
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  confirmationSub: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 300,
  },
  confirmationCard: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  confirmationCardLabel: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    color: TEXT_SECONDARY,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  confirmationStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  confirmationStepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  confirmationStepNumText: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
  confirmationStepText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: TEXT_SECONDARY,
    flex: 1,
    lineHeight: 19,
  },
});
