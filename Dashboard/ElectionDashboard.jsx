import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  Activity, TrendingUp, TrendingDown, Search, ArrowUpDown,
  ArrowUp, ArrowDown, MapPin, Trophy, Zap, ShieldAlert,
} from "lucide-react";

/* ============================================================
   DATA — aggregated directly from atliq_election.db
   (dim_constituency, fact_results_2021, fact_results_2026)
   ============================================================ */

const PARTY_COLORS = {
  TVK: "#FFD700",
  DMK: "#EF4444",
  AIADMK: "#10B981",
  INC: "#3B82F6",
  BJP: "#F97316",
  PMK: "#A855F7",
  VCK: "#A855F7",
  CPI: "#A855F7",
  "CPI(M)": "#A855F7",
  IUML: "#A855F7",
  DMDK: "#A855F7",
  AMMK: "#A855F7",
  Others: "#64748B",
};
const partyColor = (p) => PARTY_COLORS[p] || "#64748B";

const KPI = {
  totalConstituencies: 234,
  tvkSeats: 108,
  dmkSeats: 59,
  aiadmkSeats: 47,
  flippedSeats: 163,
};

const PARTY_COMPARISON = [
  { party: "TVK", y2021: 0, y2026: 108 },
  { party: "DMK", y2021: 133, y2026: 59 },
  { party: "AIADMK", y2021: 66, y2026: 47 },
  { party: "INC", y2021: 18, y2026: 5 },
  { party: "BJP", y2021: 4, y2026: 1 },
  { party: "Others", y2021: 13, y2026: 14 },
];

const REGION_BREAKDOWN = [
  { region: "Chennai Metro", total: 32, TVK: 29, DMK: 2, AIADMK: 1, Others: 0 },
  { region: "North", total: 37, TVK: 15, DMK: 4, AIADMK: 15, Others: 3 },
  { region: "Central", total: 41, TVK: 12, DMK: 8, AIADMK: 15, Others: 6 },
  { region: "Kongu", total: 33, TVK: 16, DMK: 9, AIADMK: 7, Others: 1 },
  { region: "South", total: 58, TVK: 26, DMK: 22, AIADMK: 5, Others: 5 },
  { region: "Delta", total: 33, TVK: 10, DMK: 14, AIADMK: 4, Others: 5 },
];

const LANDSLIDES = [
  { name: "Edappadi", party: "AIADMK", margin: 98110 },
  { name: "Shozhinganallur", party: "TVK", margin: 96780 },
  { name: "Madavaram", party: "TVK", margin: 94985 },
  { name: "Avadi", party: "TVK", margin: 76311 },
  { name: "Salem (West)", party: "TVK", margin: 74867 },
];

const NAILBITERS = [
  { name: "Tiruppattur", party: "TVK", runner: "DMK", margin: 1 },
  { name: "Veppanahalli", party: "DMK", runner: "AIADMK", margin: 138 },
  { name: "Kanniyakumari", party: "AIADMK", runner: "DMK", margin: 214 },
  { name: "Polur", party: "TVK", runner: "DMDK", margin: 227 },
  { name: "Tirukkoyilur", party: "AIADMK", runner: "TVK", margin: 285 },
];

/* Auto-generated from fact_results_2021 / fact_results_2026 via ac_number join */
const TABLE_DATA = [
  {ac:1,name:"Gummidipoondi",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"S.VIJAYAKUMAR",runner:"AIADMK",margin:27945,prev:"DMK",flipped:true},
  {ac:2,name:"Ponneri",region:"Chennai Metro",reserved:"SC",winner:"TVK",cand:"DR.RAVI.M.S",runner:"INC",margin:55768,prev:"INC",flipped:true},
  {ac:3,name:"Tiruttani",region:"Chennai Metro",reserved:"GEN",winner:"AIADMK",cand:"G.HARI",runner:"TVK",margin:5793,prev:"DMK",flipped:true},
  {ac:4,name:"Thiruvallur",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"DR. T. ARUNKUMAR",runner:"DMK",margin:24760,prev:"DMK",flipped:true},
  {ac:5,name:"Poonamallee",region:"Chennai Metro",reserved:"SC",winner:"TVK",cand:"PRAKASAM.R",runner:"DMK",margin:72740,prev:"DMK",flipped:true},
  {ac:6,name:"Avadi",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"R.RAMESH KUMAR",runner:"DMK",margin:76311,prev:"DMK",flipped:true},
  {ac:7,name:"Maduravoyal",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"RHEVANTH CHARAN",runner:"DMK",margin:61509,prev:"DMK",flipped:true},
  {ac:8,name:"Ambattur",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"BALAMURUGAN.G",runner:"DMK",margin:58781,prev:"DMK",flipped:true},
  {ac:9,name:"Madavaram",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"M.L.VIJAYPRABHU",runner:"DMK",margin:94985,prev:"DMK",flipped:true},
  {ac:10,name:"Thiruvottiyur",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"SENTHIL KUMAR. N",runner:"CPI(M)",margin:53564,prev:"DMK",flipped:true},
  {ac:11,name:"Dr.Radhakrishnan Nagar",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"N. MARIE WILSON",runner:"DMK",margin:49668,prev:"DMK",flipped:true},
  {ac:12,name:"Perambur",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"C. JOSEPH VIJAY",runner:"DMK",margin:53715,prev:"DMK",flipped:true},
  {ac:13,name:"Kolathur",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"V. S. BABU",runner:"DMK",margin:8795,prev:"DMK",flipped:true},
  {ac:14,name:"Villivakkam",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"AADHAV ARJUNA",runner:"DMK",margin:17302,prev:"DMK",flipped:true},
  {ac:15,name:"Thiru-Vi-Ka-Nagar",region:"Chennai Metro",reserved:"SC",winner:"TVK",cand:"M. R. PALLAVI",runner:"DMK",margin:22333,prev:"DMK",flipped:true},
  {ac:16,name:"Egmore",region:"Chennai Metro",reserved:"SC",winner:"TVK",cand:"RAJMOHAN",runner:"DMK",margin:10804,prev:"DMK",flipped:true},
  {ac:17,name:"Royapuram",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"K.V. VIJAY DAMU",runner:"DMK",margin:14249,prev:"DMK",flipped:true},
  {ac:18,name:"Harbour",region:"Chennai Metro",reserved:"GEN",winner:"DMK",cand:"P K SEKARBABU",runner:"TVK",margin:11750,prev:"DMK",flipped:false},
  {ac:19,name:"Chepauk-Thiruvallikeni",region:"Chennai Metro",reserved:"GEN",winner:"DMK",cand:"UDHAYANIDHI STALIN",runner:"TVK",margin:7140,prev:"DMK",flipped:false},
  {ac:20,name:"Thousand Lights",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"PRABHAKAR.J.C.D",runner:"DMK",margin:15141,prev:"DMK",flipped:true},
  {ac:21,name:"Anna Nagar",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"V.K.RAMKUMAR",runner:"DMK",margin:21363,prev:"DMK",flipped:true},
  {ac:22,name:"Virugampakkam",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"SABARINATHAN.R",runner:"DMK",margin:27086,prev:"DMK",flipped:true},
  {ac:23,name:"Saidapet",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"ARUL PRAKASAM. M",runner:"DMK",margin:28514,prev:"DMK",flipped:true},
  {ac:24,name:"Thiyagarayanagar",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"ANAND N",runner:"AIADMK",margin:13027,prev:"DMK",flipped:true},
  {ac:25,name:"Mylapore",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"VENKATARAMANAN. P",runner:"DMK",margin:28972,prev:"DMK",flipped:true},
  {ac:26,name:"Velachery",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"KUMAR. R",runner:"AIADMK",margin:33305,prev:"INC",flipped:true},
  {ac:27,name:"Shozhinganallur",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"ECR P SARAVANAN",runner:"DMK",margin:96780,prev:"DMK",flipped:true},
  {ac:28,name:"Alandur",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"M.HARISH",runner:"DMK",margin:29609,prev:"DMK",flipped:true},
  {ac:29,name:"Sriperumbudur",region:"Chennai Metro",reserved:"SC",winner:"TVK",cand:"THENNARASU.K",runner:"INC",margin:54246,prev:"INC",flipped:true},
  {ac:30,name:"Pallavaram",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"J.KAMATCHI",runner:"DMDK",margin:54693,prev:"DMK",flipped:true},
  {ac:31,name:"Tambaram",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"D.SARATHKUMAR",runner:"DMK",margin:35621,prev:"DMK",flipped:true},
  {ac:32,name:"Chengalpattu",region:"Chennai Metro",reserved:"GEN",winner:"TVK",cand:"S. THIYAGARAJAN",runner:"DMK",margin:35641,prev:"DMK",flipped:true},
  {ac:33,name:"Thiruporur",region:"North",reserved:"GEN",winner:"TVK",cand:"B.VIJAYARAJ",runner:"VCK",margin:39351,prev:"VCK",flipped:true},
  {ac:34,name:"Cheyyur",region:"North",reserved:"SC",winner:"AIADMK",cand:"RAJASEKAR. E",runner:"TVK",margin:5668,prev:"VCK",flipped:true},
  {ac:35,name:"Madurantakam",region:"North",reserved:"SC",winner:"AIADMK",cand:"MARAGATHAM KUMARAVEL.K",runner:"TVK",margin:7194,prev:"AIADMK",flipped:false},
  {ac:36,name:"Uthiramerur",region:"North",reserved:"GEN",winner:"TVK",cand:"MUNIRATHINAM.J",runner:"DMK",margin:14223,prev:"DMK",flipped:true},
  {ac:37,name:"Kancheepuram",region:"North",reserved:"GEN",winner:"TVK",cand:"R.V. RANJITHKUMAR",runner:"AIADMK",margin:15488,prev:"DMK",flipped:true},
  {ac:38,name:"Arakkonam",region:"North",reserved:"SC",winner:"TVK",cand:"V. GANDHIRAJ",runner:"VCK",margin:23121,prev:"AIADMK",flipped:true},
  {ac:39,name:"Sholingur",region:"North",reserved:"GEN",winner:"TVK",cand:"G.KAPIL",runner:"PMK",margin:5686,prev:"INC",flipped:true},
  {ac:40,name:"Katpadi",region:"North",reserved:"GEN",winner:"TVK",cand:"DR M SUDHAKAR",runner:"AIADMK",margin:5870,prev:"DMK",flipped:true},
  {ac:41,name:"Ranipet",region:"North",reserved:"GEN",winner:"TVK",cand:"THAHIRA",runner:"DMK",margin:5787,prev:"DMK",flipped:true},
  {ac:42,name:"Arcot",region:"North",reserved:"GEN",winner:"AIADMK",cand:"S.M.SUKUMAR",runner:"TVK",margin:42720,prev:"DMK",flipped:true},
  {ac:43,name:"Vellore",region:"North",reserved:"GEN",winner:"TVK",cand:"M.M.VINOTH KANNAN",runner:"DMK",margin:6777,prev:"DMK",flipped:true},
  {ac:44,name:"Anaikattu",region:"North",reserved:"GEN",winner:"AIADMK",cand:"D.VELAZHAGAN",runner:"DMK",margin:7081,prev:"DMK",flipped:true},
  {ac:45,name:"Kilvaithinankuppam",region:"North",reserved:"SC",winner:"TVK",cand:"THENRAL KUMAR. E",runner:"AIADMK",margin:20255,prev:"AIADMK",flipped:true},
  {ac:46,name:"Gudiyattam",region:"North",reserved:"SC",winner:"TVK",cand:"K.SINDU",runner:"DMDK",margin:10097,prev:"DMK",flipped:true},
  {ac:47,name:"Vaniyambadi",region:"North",reserved:"GEN",winner:"IUML",cand:"SYED FAROOQ BASHA SSB",runner:"TVK",margin:2982,prev:"AIADMK",flipped:true},
  {ac:48,name:"Ambur",region:"North",reserved:"GEN",winner:"DMK",cand:"VILWANATHAN. A.C.",runner:"TVK",margin:7131,prev:"DMK",flipped:false},
  {ac:49,name:"Jolarpet",region:"North",reserved:"GEN",winner:"AIADMK",cand:"VEERAMANI K.C.",runner:"TVK",margin:16083,prev:"DMK",flipped:true},
  {ac:50,name:"Tiruppattur",region:"North",reserved:"GEN",winner:"TVK",cand:"DR.THIRUPATHI. N",runner:"DMK",margin:48263,prev:"DMK",flipped:true},
  {ac:51,name:"Uthangarai",region:"North",reserved:"SC",winner:"TVK",cand:"N ELAIYARAJA",runner:"AIADMK",margin:5198,prev:"AIADMK",flipped:true},
  {ac:52,name:"Bargur",region:"North",reserved:"GEN",winner:"AIADMK",cand:"E.C. GOVINDARASAN",runner:"TVK",margin:4241,prev:"DMK",flipped:true},
  {ac:53,name:"Krishnagiri",region:"North",reserved:"GEN",winner:"TVK",cand:"MUKUNDHAN.P",runner:"AIADMK",margin:18844,prev:"AIADMK",flipped:true},
  {ac:54,name:"Veppanahalli",region:"North",reserved:"GEN",winner:"DMK",cand:"SRINIVASAN.P.S",runner:"AIADMK",margin:138,prev:"AIADMK",flipped:true},
  {ac:55,name:"Hosur",region:"North",reserved:"GEN",winner:"AIADMK",cand:"BALAKRISHNAREDDY. P",runner:"TVK",margin:27803,prev:"DMK",flipped:true},
  {ac:56,name:"Thalli",region:"North",reserved:"GEN",winner:"CPI",cand:"RAMACHANDRAN. T",runner:"BJP",margin:5240,prev:"CPI",flipped:false},
  {ac:57,name:"Palacodu",region:"North",reserved:"GEN",winner:"AIADMK",cand:"ANBALAGAN. K.P.",runner:"TVK",margin:39042,prev:"AIADMK",flipped:false},
  {ac:58,name:"Pennagaram",region:"North",reserved:"GEN",winner:"TVK",cand:"GAJENDRAN. S.",runner:"PMK",margin:3165,prev:"PMK",flipped:true},
  {ac:59,name:"Dharmapuri",region:"North",reserved:"GEN",winner:"PMK",cand:"SOWMIYA ANBUMANI",runner:"TVK",margin:20896,prev:"PMK",flipped:false},
  {ac:60,name:"Pappireddipatti",region:"North",reserved:"GEN",winner:"AIADMK",cand:"MARAGATHAM VETRIVEL",runner:"DMK",margin:33114,prev:"AIADMK",flipped:false},
  {ac:61,name:"Harur",region:"North",reserved:"SC",winner:"AIADMK",cand:"SAMPATHKUMAR. V",runner:"DMK",margin:3329,prev:"AIADMK",flipped:false},
  {ac:62,name:"Chengam",region:"North",reserved:"SC",winner:"AIADMK",cand:"S.VELU",runner:"TVK",margin:13278,prev:"DMK",flipped:true},
  {ac:63,name:"Tiruvannamalai",region:"North",reserved:"GEN",winner:"DMK",cand:"VELU. E.V",runner:"TVK",margin:2455,prev:"DMK",flipped:false},
  {ac:64,name:"Kilpennathur",region:"North",reserved:"GEN",winner:"AIADMK",cand:"RAMACHANDRAN.S",runner:"DMK",margin:30465,prev:"DMK",flipped:true},
  {ac:65,name:"Kalasapakkam",region:"North",reserved:"GEN",winner:"AIADMK",cand:"AGRI KRISHNAMURTHY. S S",runner:"DMK",margin:26740,prev:"DMK",flipped:true},
  {ac:66,name:"Polur",region:"North",reserved:"GEN",winner:"TVK",cand:"ABISHEK. R",runner:"DMDK",margin:227,prev:"AIADMK",flipped:true},
  {ac:67,name:"Arani",region:"North",reserved:"GEN",winner:"AIADMK",cand:"JAYASUDHA. L",runner:"DMK",margin:5631,prev:"AIADMK",flipped:false},
  {ac:68,name:"Cheyyar",region:"North",reserved:"GEN",winner:"AIADMK",cand:"MUKKUR N. SUBRAMANIAN",runner:"TVK",margin:21081,prev:"DMK",flipped:true},
  {ac:69,name:"Vandavasi",region:"North",reserved:"SC",winner:"DMK",cand:"AMBETHKUMAR. S",runner:"AIADMK",margin:3333,prev:"DMK",flipped:false},
  {ac:70,name:"Gingee",region:"Central",reserved:"GEN",winner:"PMK",cand:"GANESHKUMAR A",runner:"DMK",margin:12645,prev:"DMK",flipped:true},
  {ac:71,name:"Mailam",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"SHANMUGAM C VE",runner:"TVK",margin:30041,prev:"PMK",flipped:true},
  {ac:72,name:"Tindivanam",region:"Central",reserved:"SC",winner:"VCK",cand:"VANNI ARASU",runner:"AIADMK",margin:734,prev:"AIADMK",flipped:true},
  {ac:73,name:"Vanur",region:"Central",reserved:"SC",winner:"DMK",cand:"GOWTHAM D",runner:"TVK",margin:7034,prev:"AIADMK",flipped:true},
  {ac:74,name:"Viluppuram",region:"Central",reserved:"GEN",winner:"DMK",cand:"LAKSHMANAN R",runner:"TVK",margin:4119,prev:"DMK",flipped:false},
  {ac:75,name:"Vikravandi",region:"Central",reserved:"GEN",winner:"PMK",cand:"SIVAKUMAR C",runner:"TVK",margin:910,prev:"DMK",flipped:true},
  {ac:76,name:"Tirukkoyilur",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"PALANISAMY S",runner:"TVK",margin:285,prev:"DMK",flipped:true},
  {ac:77,name:"Ulundurpettai",region:"Central",reserved:"GEN",winner:"DMK",cand:"VASANTHAVEL G R",runner:"AIADMK",margin:2277,prev:"DMK",flipped:false},
  {ac:78,name:"Rishivandiyam",region:"Central",reserved:"GEN",winner:"DMK",cand:"KARTHIKEYAN K",runner:"TVK",margin:4862,prev:"DMK",flipped:false},
  {ac:79,name:"Sankarapuram",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"RAKESH R",runner:"DMK",margin:3440,prev:"DMK",flipped:true},
  {ac:80,name:"Kallakurichi",region:"Central",reserved:"SC",winner:"TVK",cand:"ARUL VIGNESH C",runner:"AIADMK",margin:798,prev:"AIADMK",flipped:true},
  {ac:81,name:"Gangavalli",region:"Central",reserved:"SC",winner:"AIADMK",cand:"NALLATHAMBI. A",runner:"DMK",margin:14404,prev:"AIADMK",flipped:false},
  {ac:82,name:"Attur",region:"Central",reserved:"SC",winner:"AIADMK",cand:"JAYASANKARAN. A.P.",runner:"TVK",margin:15318,prev:"AIADMK",flipped:false},
  {ac:83,name:"Yercaud",region:"Central",reserved:"ST",winner:"AIADMK",cand:"USHARANI. P",runner:"TVK",margin:2189,prev:"AIADMK",flipped:false},
  {ac:84,name:"Omalur",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"MANI. R",runner:"TVK",margin:14539,prev:"AIADMK",flipped:false},
  {ac:85,name:"Mettur",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"VENKATACHALAM. G",runner:"DMK",margin:19105,prev:"PMK",flipped:true},
  {ac:86,name:"Edappadi",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"EDAPPADI PALANISWAMI. K",runner:"IND",margin:98110,prev:"AIADMK",flipped:false},
  {ac:87,name:"Sankari",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"VETRIVEL. S",runner:"TVK",margin:9517,prev:"AIADMK",flipped:false},
  {ac:88,name:"Salem (West)",region:"Central",reserved:"GEN",winner:"TVK",cand:"LAKSHMANAN.S",runner:"PMK",margin:74867,prev:"PMK",flipped:true},
  {ac:89,name:"Salem (North)",region:"Central",reserved:"GEN",winner:"TVK",cand:"SIVAKUMAR. K",runner:"DMK",margin:14034,prev:"DMK",flipped:true},
  {ac:90,name:"Salem (South)",region:"Central",reserved:"GEN",winner:"TVK",cand:"VIJAY TAMILAN PARTHIBAN. A",runner:"DMK",margin:33369,prev:"AIADMK",flipped:true},
  {ac:91,name:"Veerapandi",region:"Central",reserved:"GEN",winner:"TVK",cand:"PALANIVEL. M.S",runner:"AIADMK",margin:4071,prev:"AIADMK",flipped:true},
  {ac:92,name:"Rasipuram",region:"Central",reserved:"SC",winner:"TVK",cand:"LOGESH TAMILSELVAN D",runner:"BJP",margin:14511,prev:"DMK",flipped:true},
  {ac:93,name:"Senthamangalam",region:"Central",reserved:"ST",winner:"TVK",cand:"P CHANDRASEKAR",runner:"AIADMK",margin:2655,prev:"DMK",flipped:true},
  {ac:94,name:"Namakkal",region:"Central",reserved:"GEN",winner:"TVK",cand:"DILIP C S",runner:"AIADMK",margin:11008,prev:"DMK",flipped:true},
  {ac:95,name:"Paramathi-Velur",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"SEKAR S",runner:"DMK",margin:308,prev:"AIADMK",flipped:false},
  {ac:96,name:"Tiruchengodu",region:"Central",reserved:"GEN",winner:"TVK",cand:"ARUNRAJ K G",runner:"AIADMK",margin:28172,prev:"DMK",flipped:true},
  {ac:97,name:"Kumarapalayam",region:"Central",reserved:"GEN",winner:"TVK",cand:"C.VIJAYALAKSHMI",runner:"AIADMK",margin:7696,prev:"AIADMK",flipped:true},
  {ac:98,name:"Erode (East)",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"M.VIJAY BALAJI",runner:"INC",margin:23966,prev:"INC",flipped:true},
  {ac:99,name:"Erode (West)",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"ANANTH MOGHAN K.K.",runner:"DMK",margin:22250,prev:"DMK",flipped:true},
  {ac:100,name:"Modakkurichi",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"D.SHANMUGAN",runner:"BJP",margin:2430,prev:"BJP",flipped:true},
  {ac:101,name:"Dharapuram",region:"Kongu",reserved:"SC",winner:"AIADMK",cand:"SATHYABAMA.P",runner:"DMK",margin:16727,prev:"DMK",flipped:true},
  {ac:102,name:"Kangayam",region:"Kongu",reserved:"GEN",winner:"AIADMK",cand:"NSN NATARAJ",runner:"TVK",margin:8133,prev:"DMK",flipped:true},
  {ac:103,name:"Perundurai",region:"Kongu",reserved:"GEN",winner:"AIADMK",cand:"JAYAKUMAR. S",runner:"DMK",margin:9693,prev:"AIADMK",flipped:false},
  {ac:104,name:"Bhavani",region:"Kongu",reserved:"GEN",winner:"AIADMK",cand:"KARUPPANAN. K.C",runner:"TVK",margin:7396,prev:"AIADMK",flipped:false},
  {ac:105,name:"Anthiyur",region:"Kongu",reserved:"GEN",winner:"AIADMK",cand:"HARIBASKAR.P",runner:"DMK",margin:1260,prev:"DMK",flipped:true},
  {ac:106,name:"Gobichettipalayam",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"SENGOTTAIYAN.K.A",runner:"DMK",margin:16620,prev:"AIADMK",flipped:true},
  {ac:107,name:"Bhavanisagar",region:"Kongu",reserved:"SC",winner:"TVK",cand:"V.P.TAMILSELVI",runner:"AIADMK",margin:4569,prev:"AIADMK",flipped:true},
  {ac:108,name:"Udhagamandalam",region:"Kongu",reserved:"GEN",winner:"BJP",cand:"BHOJARAJAN.M",runner:"TVK",margin:976,prev:"INC",flipped:true},
  {ac:109,name:"Gudalur",region:"Kongu",reserved:"SC",winner:"DMK",cand:"DHRAVIDAMANI.M",runner:"AIADMK",margin:22833,prev:"AIADMK",flipped:true},
  {ac:110,name:"Coonoor",region:"Kongu",reserved:"GEN",winner:"DMK",cand:"M. RAJU",runner:"AIADMK",margin:8099,prev:"DMK",flipped:false},
  {ac:111,name:"Mettuppalayam",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"SUNILANAND",runner:"DMK",margin:7768,prev:"AIADMK",flipped:true},
  {ac:112,name:"Avanashi",region:"Kongu",reserved:"SC",winner:"TVK",cand:"KAMALI.S",runner:"BJP",margin:15373,prev:"AIADMK",flipped:true},
  {ac:113,name:"Tiruppur (North)",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"V.SATHYABAMA",runner:"AIADMK",margin:69992,prev:"AIADMK",flipped:true},
  {ac:114,name:"Tiruppur (South)",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"BALAMURUGAN. S",runner:"DMK",margin:12901,prev:"DMK",flipped:true},
  {ac:115,name:"Palladam",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"K.RAMKUMAR",runner:"AIADMK",margin:37897,prev:"AIADMK",flipped:true},
  {ac:116,name:"Sulur",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"NM.SUKUMAR",runner:"AIADMK",margin:4790,prev:"AIADMK",flipped:true},
  {ac:117,name:"Kavundampalayam",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"KANIMOZHI SANTHOSH",runner:"AIADMK",margin:42140,prev:"AIADMK",flipped:true},
  {ac:118,name:"Coimbatore (North)",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"V. SAMPATHKUMAR",runner:"DMK",margin:21992,prev:"AIADMK",flipped:true},
  {ac:119,name:"Thondamuthur",region:"Kongu",reserved:"GEN",winner:"AIADMK",cand:"S.P.VELUMANI",runner:"TVK",margin:14725,prev:"AIADMK",flipped:false},
  {ac:120,name:"Coimbatore (South)",region:"Kongu",reserved:"GEN",winner:"DMK",cand:"V SENTHILBALAJI",runner:"TVK",margin:2271,prev:"BJP",flipped:true},
  {ac:121,name:"Singanallur",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"K.S.SRI GIRI PRASATH",runner:"INC",margin:19139,prev:"AIADMK",flipped:true},
  {ac:122,name:"Kinathukadavu",region:"Kongu",reserved:"GEN",winner:"TVK",cand:"VIGNESH K",runner:"DMK",margin:11710,prev:"AIADMK",flipped:true},
  {ac:123,name:"Pollachi",region:"Kongu",reserved:"GEN",winner:"DMK",cand:"K. NITHYANANDHAN",runner:"AIADMK",margin:4627,prev:"AIADMK",flipped:true},
  {ac:124,name:"Valparai",region:"Kongu",reserved:"SC",winner:"DMK",cand:"KUTTY (ALIAS) SUDHAKAR. A",runner:"TVK",margin:9371,prev:"AIADMK",flipped:true},
  {ac:125,name:"Udumalaipettai",region:"Kongu",reserved:"GEN",winner:"DMK",cand:"JAYAKUMAR M.",runner:"AIADMK",margin:2882,prev:"AIADMK",flipped:true},
  {ac:126,name:"Madathukulam",region:"Kongu",reserved:"GEN",winner:"DMK",cand:"R JAYARAMAKRISHNAN",runner:"AMMK",margin:15968,prev:"AIADMK",flipped:true},
  {ac:127,name:"Palani",region:"South",reserved:"GEN",winner:"AIADMK",cand:"RAVIMANOHARAN. K",runner:"TVK",margin:693,prev:"DMK",flipped:true},
  {ac:128,name:"Oddanchatram",region:"South",reserved:"GEN",winner:"DMK",cand:"SAKKARAPANI. R",runner:"BJP",margin:43249,prev:"DMK",flipped:false},
  {ac:129,name:"Athoor",region:"South",reserved:"GEN",winner:"DMK",cand:"I. PERIASAMY",runner:"TVK",margin:22368,prev:"DMK",flipped:false},
  {ac:130,name:"Nilakkottai",region:"South",reserved:"SC",winner:"TVK",cand:"AYYANAR.R",runner:"DMK",margin:2925,prev:"AIADMK",flipped:true},
  {ac:131,name:"Natham",region:"South",reserved:"GEN",winner:"AIADMK",cand:"NATHAM VISWANATHAN R",runner:"DMK",margin:11869,prev:"AIADMK",flipped:false},
  {ac:132,name:"Dindigul",region:"South",reserved:"GEN",winner:"DMK",cand:"SENTHILKUMAR. I.P",runner:"TVK",margin:1131,prev:"AIADMK",flipped:true},
  {ac:133,name:"Vedasandur",region:"South",reserved:"GEN",winner:"DMK",cand:"SAMINATHAN. T",runner:"AIADMK",margin:10063,prev:"DMK",flipped:false},
  {ac:134,name:"Aravakurichi",region:"Kongu",reserved:"GEN",winner:"DMK",cand:"ELANGO. R",runner:"TVK",margin:19382,prev:"DMK",flipped:false},
  {ac:135,name:"Karur",region:"Kongu",reserved:"GEN",winner:"AIADMK",cand:"M.R. VIJAYABHASKAR",runner:"TVK",margin:1821,prev:"DMK",flipped:true},
  {ac:136,name:"Krishnarayapuram",region:"Kongu",reserved:"SC",winner:"TVK",cand:"SATHYA. M",runner:"AIADMK",margin:3503,prev:"DMK",flipped:true},
  {ac:137,name:"Kulithalai",region:"Kongu",reserved:"GEN",winner:"DMK",cand:"SURIYANUR. A. CHANDRAN",runner:"TVK",margin:579,prev:"DMK",flipped:false},
  {ac:138,name:"Manapparai",region:"Delta",reserved:"GEN",winner:"TVK",cand:"R. KATHIRAVAN",runner:"AIADMK",margin:1426,prev:"DMK",flipped:true},
  {ac:139,name:"Srirangam",region:"Delta",reserved:"GEN",winner:"TVK",cand:"RAMESH",runner:"DMK",margin:33590,prev:"DMK",flipped:true},
  {ac:140,name:"Tiruchirappalli (West)",region:"Delta",reserved:"GEN",winner:"DMK",cand:"K.N.NEHRU",runner:"TVK",margin:4786,prev:"DMK",flipped:false},
  {ac:141,name:"Tiruchirappalli (East)",region:"Delta",reserved:"GEN",winner:"TVK",cand:"C. JOSEPH VIJAY",runner:"DMK",margin:27416,prev:"DMK",flipped:true},
  {ac:142,name:"Thiruverumbur",region:"Delta",reserved:"GEN",winner:"TVK",cand:"VIJAYAKUMAR (A) NAVALPATTU S. VIJI",runner:"DMK",margin:8705,prev:"DMK",flipped:true},
  {ac:143,name:"Lalgudi",region:"Delta",reserved:"GEN",winner:"AIADMK",cand:"LEEMAROSE MARTIN",runner:"TVK",margin:2739,prev:"DMK",flipped:true},
  {ac:144,name:"Manachanallur",region:"Delta",reserved:"GEN",winner:"DMK",cand:"KATHIRAVAN. S",runner:"TVK",margin:12364,prev:"DMK",flipped:false},
  {ac:145,name:"Musiri",region:"Delta",reserved:"GEN",winner:"TVK",cand:"M.VIGNESH",runner:"DMK",margin:17442,prev:"DMK",flipped:true},
  {ac:146,name:"Thuraiyur",region:"Delta",reserved:"SC",winner:"TVK",cand:"RAVISANKAR.M",runner:"AIADMK",margin:9614,prev:"DMK",flipped:true},
  {ac:147,name:"Perambalur",region:"Central",reserved:"SC",winner:"TVK",cand:"SIVAKUMAR. K",runner:"DMK",margin:14393,prev:"DMK",flipped:true},
  {ac:148,name:"Kunnam",region:"Central",reserved:"GEN",winner:"DMK",cand:"SIVASANKAR. S.S",runner:"AIADMK",margin:15557,prev:"DMK",flipped:false},
  {ac:149,name:"Ariyalur",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"RAJENDRAN S",runner:"DMK",margin:24498,prev:"DMK",flipped:true},
  {ac:150,name:"Jayankondam",region:"Central",reserved:"GEN",winner:"PMK",cand:"VAITHILINGAM G.",runner:"DMK",margin:18490,prev:"DMK",flipped:true},
  {ac:151,name:"Tittakudi",region:"Central",reserved:"SC",winner:"DMK",cand:"GANESAN C.V",runner:"TVK",margin:2629,prev:"DMK",flipped:false},
  {ac:152,name:"Vriddhachalam",region:"Central",reserved:"GEN",winner:"DMDK",cand:"PREMALLATHA VIJAYAKANT",runner:"TVK",margin:2387,prev:"INC",flipped:true},
  {ac:153,name:"Neyveli",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"RAJENDRAN.R",runner:"DMK",margin:10962,prev:"DMK",flipped:true},
  {ac:154,name:"Panruti",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"MOHAN. K",runner:"VCK",margin:10663,prev:"DMK",flipped:true},
  {ac:155,name:"Cuddalore",region:"Central",reserved:"GEN",winner:"TVK",cand:"B.RAJKUMAR",runner:"INC",margin:15519,prev:"DMK",flipped:true},
  {ac:156,name:"Kurinjipadi",region:"Central",reserved:"GEN",winner:"DMK",cand:"M.R.K.PANNEERSELVAM",runner:"AIADMK",margin:7589,prev:"DMK",flipped:false},
  {ac:157,name:"Bhuvanagiri",region:"Central",reserved:"GEN",winner:"AIADMK",cand:"ARUNMOZHITHEVAN . A",runner:"DMK",margin:2487,prev:"AIADMK",flipped:false},
  {ac:158,name:"Chidambaram",region:"Central",reserved:"GEN",winner:"DMK",cand:"THAMIMUN ANSARI. M",runner:"AIADMK",margin:5747,prev:"AIADMK",flipped:true},
  {ac:159,name:"Kattumannarkoil",region:"Central",reserved:"SC",winner:"VCK",cand:"L.E. JOTHIMANI",runner:"PMK",margin:33063,prev:"VCK",flipped:false},
  {ac:160,name:"Sirkazhi",region:"Delta",reserved:"SC",winner:"DMK",cand:"SENTHILSELVAN.R",runner:"AIADMK",margin:11417,prev:"DMK",flipped:false},
  {ac:161,name:"Mayiladuthurai",region:"Delta",reserved:"GEN",winner:"INC",cand:"JAMAL MOHAMED YOUNOOS. Y.N",runner:"PMK",margin:10845,prev:"INC",flipped:false},
  {ac:162,name:"Poompuhar",region:"Delta",reserved:"GEN",winner:"DMK",cand:"NIVEDHA M MURUGAN",runner:"AIADMK",margin:8260,prev:"DMK",flipped:false},
  {ac:163,name:"Nagapattinam",region:"Delta",reserved:"GEN",winner:"DMK",cand:"M.H.JAWAHIRULLAH",runner:"TVK",margin:9781,prev:"VCK",flipped:true},
  {ac:164,name:"Kilvelur",region:"Delta",reserved:"SC",winner:"CPI(M)",cand:"LATHA. T",runner:"TVK",margin:2278,prev:"CPI(M)",flipped:false},
  {ac:165,name:"Vedaranyam",region:"Delta",reserved:"GEN",winner:"AIADMK",cand:"MANIAN. O.S",runner:"DMK",margin:7331,prev:"AIADMK",flipped:false},
  {ac:166,name:"Thiruthuraipoondi",region:"Delta",reserved:"SC",winner:"CPI",cand:"MARIMUTHU.K",runner:"TVK",margin:12922,prev:"CPI",flipped:false},
  {ac:167,name:"Mannargudi",region:"Delta",reserved:"GEN",winner:"AMMK",cand:"KAMARAJ. S",runner:"DMK",margin:1566,prev:"DMK",flipped:true},
  {ac:168,name:"Thiruvarur",region:"Delta",reserved:"GEN",winner:"DMK",cand:"KALAIVANAN POONDI  K",runner:"TVK",margin:18148,prev:"DMK",flipped:false},
  {ac:169,name:"Nannilam",region:"Delta",reserved:"GEN",winner:"AIADMK",cand:"KAMARAJ. R",runner:"DMK",margin:41724,prev:"AIADMK",flipped:false},
  {ac:170,name:"Thiruvidaimarudur",region:"Delta",reserved:"SC",winner:"DMK",cand:"GOVI.CHEZHIAAN",runner:"TVK",margin:14116,prev:"DMK",flipped:false},
  {ac:171,name:"Kumbakonam",region:"Delta",reserved:"GEN",winner:"TVK",cand:"VINOTH",runner:"DMK",margin:679,prev:"DMK",flipped:true},
  {ac:172,name:"Papanasam",region:"Delta",reserved:"GEN",winner:"IUML",cand:"A.M. SHAHJAHAN",runner:"TVK",margin:1065,prev:"DMK",flipped:true},
  {ac:173,name:"Thiruvaiyaru",region:"Delta",reserved:"GEN",winner:"DMK",cand:"DURAI. CHANDRASEKARAN",runner:"TVK",margin:8555,prev:"DMK",flipped:false},
  {ac:174,name:"Thanjavur",region:"Delta",reserved:"GEN",winner:"TVK",cand:"R. VIJAYSARAVANAN",runner:"DMK",margin:16955,prev:"DMK",flipped:true},
  {ac:175,name:"Orathanadu",region:"Delta",reserved:"GEN",winner:"DMK",cand:"R. VAITHILINGAM",runner:"TVK",margin:35028,prev:"AIADMK",flipped:true},
  {ac:176,name:"Pattukkottai",region:"Delta",reserved:"GEN",winner:"DMK",cand:"ANNADURAI K",runner:"TVK",margin:13754,prev:"DMK",flipped:false},
  {ac:177,name:"Peravurani",region:"Delta",reserved:"GEN",winner:"DMK",cand:"ASHOKKUMAR. N",runner:"AIADMK",margin:3162,prev:"DMK",flipped:false},
  {ac:178,name:"Gandharvakottai",region:"Delta",reserved:"SC",winner:"TVK",cand:"N. SUBRAMANIAN",runner:"BJP",margin:11039,prev:"CPI(M)",flipped:true},
  {ac:179,name:"Viralimalai",region:"Delta",reserved:"GEN",winner:"AIADMK",cand:"VIJAYABASKAR. C",runner:"TVK",margin:62073,prev:"AIADMK",flipped:false},
  {ac:180,name:"Pudukkottai",region:"Delta",reserved:"GEN",winner:"DMK",cand:"V. MUTHURAJA",runner:"TVK",margin:1867,prev:"DMK",flipped:false},
  {ac:181,name:"Thirumayam",region:"Delta",reserved:"GEN",winner:"DMK",cand:"REGUPATHY.S",runner:"TVK",margin:1492,prev:"DMK",flipped:false},
  {ac:182,name:"Alangudi",region:"Delta",reserved:"GEN",winner:"DMK",cand:"SIVA.V.MEYYANATHAN",runner:"TVK",margin:12977,prev:"DMK",flipped:false},
  {ac:183,name:"Aranthangi",region:"Delta",reserved:"GEN",winner:"TVK",cand:"MOHAMED FARVAS. J",runner:"INC",margin:10062,prev:"INC",flipped:true},
  {ac:184,name:"Karaikudi",region:"South",reserved:"GEN",winner:"TVK",cand:"DR.PRABHU. TK",runner:"INC",margin:46074,prev:"INC",flipped:true},
  {ac:185,name:"Tiruppattur",region:"South",reserved:"GEN",winner:"TVK",cand:"SEENIVASA SETHUPATHY. R",runner:"DMK",margin:1,prev:"DMK",flipped:true},
  {ac:186,name:"Sivaganga",region:"South",reserved:"GEN",winner:"TVK",cand:"KULANTHAI RANI A",runner:"AIADMK",margin:15081,prev:"AIADMK",flipped:true},
  {ac:187,name:"Manamadurai",region:"South",reserved:"SC",winner:"TVK",cand:"ELANGOVAN.D",runner:"DMK",margin:1208,prev:"DMK",flipped:true},
  {ac:188,name:"Melur",region:"South",reserved:"GEN",winner:"INC",cand:"P.VISWANATHAN",runner:"TVK",margin:2724,prev:"AIADMK",flipped:true},
  {ac:189,name:"Madurai East",region:"South",reserved:"GEN",winner:"TVK",cand:"KARTHIKEYAN S",runner:"DMK",margin:16547,prev:"DMK",flipped:true},
  {ac:190,name:"Sholavandan",region:"South",reserved:"SC",winner:"TVK",cand:"KARUPPAIAH.M.V",runner:"DMK",margin:2678,prev:"DMK",flipped:true},
  {ac:191,name:"Madurai North",region:"South",reserved:"GEN",winner:"TVK",cand:"A.KALLANAI",runner:"DMK",margin:18038,prev:"DMK",flipped:true},
  {ac:192,name:"Madurai South",region:"South",reserved:"GEN",winner:"TVK",cand:"M.M.GOPISON",runner:"DMK",margin:21529,prev:"DMK",flipped:true},
  {ac:193,name:"Madurai Central",region:"South",reserved:"GEN",winner:"TVK",cand:"MADHAR BADHURUDEEN",runner:"DMK",margin:19128,prev:"DMK",flipped:true},
  {ac:194,name:"Madurai West",region:"South",reserved:"GEN",winner:"TVK",cand:"THANGAPANDI SR",runner:"DMK",margin:11931,prev:"AIADMK",flipped:true},
  {ac:195,name:"Thiruparankundram",region:"South",reserved:"GEN",winner:"TVK",cand:"NIRMALKUMAR. R.",runner:"DMK",margin:41553,prev:"AIADMK",flipped:true},
  {ac:196,name:"Thirumangalam",region:"South",reserved:"GEN",winner:"DMK",cand:"MANIMARAN.M",runner:"AIADMK",margin:23807,prev:"AIADMK",flipped:true},
  {ac:197,name:"Usilampatti",region:"South",reserved:"GEN",winner:"TVK",cand:"VIJAY. M",runner:"AIADMK",margin:1805,prev:"AIADMK",flipped:true},
  {ac:198,name:"Andipatti",region:"South",reserved:"GEN",winner:"DMK",cand:"MAHARAJAN.A",runner:"TVK",margin:9554,prev:"DMK",flipped:false},
  {ac:199,name:"Periyakulam",region:"South",reserved:"SC",winner:"TVK",cand:"SABARI IYNGARAN G.",runner:"VCK",margin:19321,prev:"DMK",flipped:true},
  {ac:200,name:"Bodinayakanur",region:"South",reserved:"GEN",winner:"DMK",cand:"PANNEERSELVAM.O",runner:"TVK",margin:6805,prev:"AIADMK",flipped:true},
  {ac:201,name:"Cumbum",region:"South",reserved:"GEN",winner:"TVK",cand:"JEGANATHMISHRA PLA",runner:"DMK",margin:751,prev:"DMK",flipped:true},
  {ac:202,name:"Rajapalayam",region:"South",reserved:"GEN",winner:"TVK",cand:"JEGADESHWARI. K",runner:"DMK",margin:10605,prev:"DMK",flipped:true},
  {ac:203,name:"Srivilliputhur",region:"South",reserved:"SC",winner:"TVK",cand:"KARTHIK.A",runner:"CPI",margin:8581,prev:"AIADMK",flipped:true},
  {ac:204,name:"Sattur",region:"South",reserved:"GEN",winner:"DMK",cand:"KADARKARAIRAJ. A",runner:"BJP",margin:5989,prev:"DMK",flipped:false},
  {ac:205,name:"Sivakasi",region:"South",reserved:"GEN",winner:"TVK",cand:"KEERTHANA S",runner:"INC",margin:11670,prev:"INC",flipped:true},
  {ac:206,name:"Virudhunagar",region:"South",reserved:"GEN",winner:"TVK",cand:"SELVAM P",runner:"DMDK",margin:9391,prev:"DMK",flipped:true},
  {ac:207,name:"Aruppukkottai",region:"South",reserved:"GEN",winner:"DMK",cand:"RAMACHANDRAN. K.K.S.S.R",runner:"TVK",margin:4943,prev:"DMK",flipped:false},
  {ac:208,name:"Tiruchuli",region:"South",reserved:"GEN",winner:"DMK",cand:"THANGAM THENARASU",runner:"TVK",margin:13485,prev:"DMK",flipped:false},
  {ac:209,name:"Paramakudi",region:"South",reserved:"SC",winner:"DMK",cand:"ADVOCATE. KATHIRAVAN. K.K",runner:"TVK",margin:3548,prev:"DMK",flipped:false},
  {ac:210,name:"Tiruvadanai",region:"South",reserved:"GEN",winner:"TVK",cand:"RAJEEV",runner:"INC",margin:2513,prev:"INC",flipped:true},
  {ac:211,name:"Ramanathapuram",region:"South",reserved:"GEN",winner:"DMK",cand:"KATHARBATCHA MUTHURAMALINGAM",runner:"TVK",margin:12459,prev:"DMK",flipped:false},
  {ac:212,name:"Mudhukulathur",region:"South",reserved:"GEN",winner:"DMK",cand:"R.S.RAJAKANNAPPAN",runner:"TVK",margin:16598,prev:"DMK",flipped:false},
  {ac:213,name:"Vilathikulam",region:"South",reserved:"GEN",winner:"DMK",cand:"MARKANDAYAN G V",runner:"TVK",margin:8228,prev:"DMK",flipped:false},
  {ac:214,name:"Thoothukkudi",region:"South",reserved:"GEN",winner:"TVK",cand:"SRINATH",runner:"DMK",margin:37731,prev:"DMK",flipped:true},
  {ac:215,name:"Tiruchendur",region:"South",reserved:"GEN",winner:"DMK",cand:"ANITHA R. RADHAKRISHNAN",runner:"TVK",margin:5872,prev:"DMK",flipped:false},
  {ac:216,name:"Srivaikuntam",region:"South",reserved:"GEN",winner:"TVK",cand:"SARAVANAN. G",runner:"AIADMK",margin:1186,prev:"INC",flipped:true},
  {ac:217,name:"Ottapidaram",region:"South",reserved:"SC",winner:"TVK",cand:"P .MATHANRAJA",runner:"DMK",margin:29083,prev:"DMK",flipped:true},
  {ac:218,name:"Kovilpatti",region:"South",reserved:"GEN",winner:"DMK",cand:"KARUNANITHI.K",runner:"TVK",margin:843,prev:"AIADMK",flipped:true},
  {ac:219,name:"Sankarankovil",region:"South",reserved:"SC",winner:"AIADMK",cand:"DR. DHILIPAN JAISHANKAR",runner:"TVK",margin:6489,prev:"DMK",flipped:true},
  {ac:220,name:"Vasudevanallur",region:"South",reserved:"SC",winner:"DMK",cand:"E. RAJA",runner:"BJP",margin:6583,prev:"DMK",flipped:false},
  {ac:221,name:"Kadayanallur",region:"South",reserved:"GEN",winner:"DMK",cand:"RAJENDRAN. T. M",runner:"AIADMK",margin:6253,prev:"AIADMK",flipped:true},
  {ac:222,name:"Tenkasi",region:"South",reserved:"GEN",winner:"DMK",cand:"DR.KALAI KATHIRAVAN",runner:"AIADMK",margin:10299,prev:"INC",flipped:true},
  {ac:223,name:"Alangulam",region:"South",reserved:"GEN",winner:"DMK",cand:"PAUL MANOJ PANDIAN",runner:"AIADMK",margin:7798,prev:"AIADMK",flipped:true},
  {ac:224,name:"Tirunelveli",region:"South",reserved:"GEN",winner:"TVK",cand:"MURUGHAN.R.S.",runner:"DMK",margin:11414,prev:"BJP",flipped:true},
  {ac:225,name:"Ambasamudram",region:"South",reserved:"GEN",winner:"AIADMK",cand:"DR.ESAKKI SUBAYA",runner:"INC",margin:10245,prev:"AIADMK",flipped:false},
  {ac:226,name:"Palayamkottai",region:"South",reserved:"GEN",winner:"DMK",cand:"M.ABDUL WAHAB",runner:"TVK",margin:13805,prev:"DMK",flipped:false},
  {ac:227,name:"Nanguneri",region:"South",reserved:"GEN",winner:"TVK",cand:"REDDIARPATTI V. NARAYANAN",runner:"INC",margin:16419,prev:"INC",flipped:true},
  {ac:228,name:"Radhapuram",region:"South",reserved:"GEN",winner:"TVK",cand:"DR.SATHISH CHRISTOPHER",runner:"DMK",margin:12313,prev:"DMK",flipped:true},
  {ac:229,name:"Kanniyakumari",region:"South",reserved:"GEN",winner:"AIADMK",cand:"THALAVAI SUNDARAM. N",runner:"DMK",margin:214,prev:"AIADMK",flipped:false},
  {ac:230,name:"Nagercoil",region:"South",reserved:"GEN",winner:"DMK",cand:"AUSTIN",runner:"TVK",margin:7570,prev:"BJP",flipped:true},
  {ac:231,name:"Colachal",region:"South",reserved:"GEN",winner:"INC",cand:"THARAHAI CUTHBERT",runner:"TVK",margin:2833,prev:"INC",flipped:false},
  {ac:232,name:"Padmanabhapuram",region:"South",reserved:"GEN",winner:"CPI(M)",cand:"CHELLASWAMY. R",runner:"TVK",margin:15569,prev:"DMK",flipped:true},
  {ac:233,name:"Vilavancode",region:"South",reserved:"GEN",winner:"INC",cand:"PRAVEEN T.T",runner:"TVK",margin:20970,prev:"INC",flipped:false},
  {ac:234,name:"Killiyoor",region:"South",reserved:"GEN",winner:"INC",cand:"RAJESH KUMAR. S",runner:"TVK",margin:1311,prev:"INC",flipped:false},
];

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */

function GlassCard({ children, className = "", glow = false }) {
  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-300 ${className}`}
      style={{
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: glow ? "0 0 0 1px rgba(0,229,255,0.25), 0 0 30px rgba(0,229,255,0.08)" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,229,255,0.45)";
        e.currentTarget.style.boxShadow = "0 0 24px rgba(0,229,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.boxShadow = glow ? "0 0 0 1px rgba(0,229,255,0.25), 0 0 30px rgba(0,229,255,0.08)" : "none";
      }}
    >
      {children}
    </div>
  );
}

function PartyPill({ party }) {
  const c = partyColor(party);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: `${c}1A`, color: c, border: `1px solid ${c}40` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
      {party}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{ backgroundColor: "#0D1420", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      <div className="text-gray-300 font-semibold mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-400">{p.name}:</span>
          <span className="font-mono font-semibold">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   MAIN DASHBOARD
   ============================================================ */

export default function ElectionDashboard() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("ac");
  const [sortDir, setSortDir] = useState("asc");
  const [regionFilter, setRegionFilter] = useState("All");

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(TABLE_DATA.map((r) => r.region)))],
    []
  );

  const filtered = useMemo(() => {
    let rows = TABLE_DATA;
    if (regionFilter !== "All") rows = rows.filter((r) => r.region === regionFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.winner.toLowerCase().includes(q) ||
          r.runner.toLowerCase().includes(q) ||
          r.region.toLowerCase().includes(q) ||
          r.cand.toLowerCase().includes(q)
      );
    }
    const sorted = [...rows].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (typeof av === "string") {
        av = av.toLowerCase();
        bv = bv.toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [query, sortKey, sortDir, regionFilter]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortHeader = ({ label, sortKeyName, align = "left" }) => (
    <th
      className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 cursor-pointer select-none whitespace-nowrap text-${align}`}
      onClick={() => toggleSort(sortKeyName)}
    >
      <span className="inline-flex items-center gap-1 hover:text-gray-200 transition-colors">
        {label}
        {sortKey === sortKeyName ? (
          sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />
        ) : (
          <ArrowUpDown size={12} className="opacity-40" />
        )}
      </span>
    </th>
  );

  return (
    <div
      className="min-h-screen w-full font-sans"
      style={{ backgroundColor: "#090D16", color: "#E5E7EB" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ============ HEADER BAR ============ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)" }}
              >
                <Activity size={20} color="#00E5FF" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  AtliQ Media Broadcast — Tamil Nadu 2026 Election Desk
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Real-time ECI Data Engine &nbsp;|&nbsp; Developer: Hritik Raj (DS Vidhya)
                </p>
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full self-start sm:self-auto"
            style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#22C55E" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#22C55E" }} />
            </span>
            <span className="text-xs font-medium text-green-400">SQL Warehouse Active</span>
          </div>
        </div>

        {/* ============ TIER 1: KPI RIBBON ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Constituencies</p>
                <p className="text-3xl font-bold text-white mt-1">{KPI.totalConstituencies}</p>
                <p className="text-xs text-gray-500 mt-1">100% Form 20 Validated</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <MapPin size={18} className="text-gray-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">TVK Seat Tally</p>
                <p className="text-3xl font-bold mt-1" style={{ color: "#FFD700" }}>{KPI.tvkSeats} <span className="text-base text-gray-500 font-medium">Seats</span></p>
                <p className="text-xs mt-1" style={{ color: "#FFD700" }}>Single Largest Party — Short by 10 of 118 Majority</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255,215,0,0.1)" }}>
                <Trophy size={18} style={{ color: "#FFD700" }} />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">DMK vs AIADMK</p>
                <p className="text-2xl font-bold mt-1">
                  <span style={{ color: "#EF4444" }}>{KPI.dmkSeats}</span>
                  <span className="text-gray-600 mx-1 text-lg">|</span>
                  <span style={{ color: "#10B981" }}>{KPI.aiadmkSeats}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Major Traditional Base Erosion</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                <TrendingDown size={18} className="text-gray-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard glow>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Electoral Shifts</p>
                <p className="text-3xl font-bold mt-1" style={{ color: "#00E5FF" }}>{KPI.flippedSeats}</p>
                <p className="text-xs mt-1" style={{ color: "#00E5FF" }}>Flipped Seats — Historic Swing vs 2021</p>
              </div>
              <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(0,229,255,0.1)" }}>
                <Zap size={18} style={{ color: "#00E5FF" }} />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ============ TIER 2: BATTLEGROUND ANALYTICS ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <GlassCard>
            <h2 className="text-sm font-semibold text-white mb-1">Party Seat Comparison — 2021 vs 2026</h2>
            <p className="text-xs text-gray-500 mb-4">Seats won per party across both assembly cycles</p>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={PARTY_COMPARISON} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="party" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "#9CA3AF" }} />
                  <Bar dataKey="y2021" name="2021" radius={[4, 4, 0, 0]} fill="#374151" />
                  <Bar dataKey="y2026" name="2026" radius={[4, 4, 0, 0]}>
                    {PARTY_COMPARISON.map((entry) => (
                      <Cell key={entry.party} fill={partyColor(entry.party)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-sm font-semibold text-white mb-1">Regional Distribution — 2026</h2>
            <p className="text-xs text-gray-500 mb-4">
              Chennai Metro: {REGION_BREAKDOWN[0].TVK}/{REGION_BREAKDOWN[0].total} TVK sweep vs multi-cornered Kongu / Delta
            </p>
            <div className="space-y-3">
              {REGION_BREAKDOWN.map((r) => (
                <div key={r.region}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 font-medium">{r.region}</span>
                    <span className="text-gray-500">{r.total} seats</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                    {["TVK", "DMK", "AIADMK", "Others"].map((p) =>
                      r[p] > 0 ? (
                        <div
                          key={p}
                          style={{ width: `${(r[p] / r.total) * 100}%`, backgroundColor: partyColor(p) }}
                          title={`${p}: ${r[p]}`}
                        />
                      ) : null
                    )}
                  </div>
                  <div className="flex gap-3 mt-1 flex-wrap">
                    {["TVK", "DMK", "AIADMK", "Others"].map((p) =>
                      r[p] > 0 ? (
                        <span key={p} className="text-[10px] text-gray-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: partyColor(p) }} />
                          {p} {r[p]}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ============ TIER 3: EXTREMES + DRILL-DOWN TABLE ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard>
            <h2 className="text-sm font-semibold text-white mb-4">Landslides vs Nail-Biters</h2>

            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} style={{ color: "#22C55E" }} />
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Landslide Victories</span>
              </div>
              <div className="space-y-2">
                {LANDSLIDES.map((l) => (
                  <div key={l.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <PartyPill party={l.party} />
                      <span className="text-gray-300">{l.name}</span>
                    </div>
                    <span className="font-mono font-semibold" style={{ color: "#22C55E" }}>
                      +{l.margin.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert size={14} style={{ color: "#F43F5E" }} />
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Razor-Thin Micro-Margins</span>
              </div>
              <div className="space-y-2">
                {NAILBITERS.map((l) => (
                  <div key={l.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <PartyPill party={l.party} />
                      <span className="text-gray-300">{l.name}</span>
                      <span className="text-gray-600 text-xs">vs {l.runner}</span>
                    </div>
                    <span className="font-mono font-semibold" style={{ color: "#F43F5E" }}>
                      +{l.margin.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-600 mt-2 italic">
                Tiruppattur decided by a single vote — the tightest contest of TN 2026.
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <h2 className="text-sm font-semibold text-white">Constituency Drill-Down</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search constituency, party..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg outline-none w-full sm:w-56"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#E5E7EB",
                    }}
                  />
                </div>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="text-xs rounded-lg px-2 py-1.5 outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#E5E7EB",
                  }}
                >
                  {regions.map((r) => (
                    <option key={r} value={r} style={{ backgroundColor: "#111827" }}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 mb-2">
              Showing {filtered.length} of {TABLE_DATA.length} constituencies
            </div>

            <div className="overflow-auto rounded-lg" style={{ maxHeight: 420, border: "1px solid rgba(255,255,255,0.06)" }}>
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10" style={{ backgroundColor: "#0D1420" }}>
                  <tr>
                    <SortHeader label="AC#" sortKeyName="ac" />
                    <SortHeader label="Constituency" sortKeyName="name" />
                    <SortHeader label="Winner" sortKeyName="winner" />
                    <SortHeader label="Runner-up" sortKeyName="runner" />
                    <SortHeader label="Margin" sortKeyName="margin" align="right" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.ac}
                      className="hover:bg-white/[0.03] transition-colors"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <td className="px-3 py-2 text-gray-500 font-mono text-xs">{r.ac}</td>
                      <td className="px-3 py-2 text-gray-200">
                        <div className="flex items-center gap-1.5">
                          {r.name}
                          {r.flipped && (
                            <span
                              className="text-[9px] px-1 py-0.5 rounded font-semibold"
                              style={{ color: "#00E5FF", backgroundColor: "rgba(0,229,255,0.1)" }}
                              title={`Flipped from ${r.prev}`}
                            >
                              FLIP
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <PartyPill party={r.winner} />
                      </td>
                      <td className="px-3 py-2">
                        {r.runner ? <PartyPill party={r.runner} /> : <span className="text-gray-600 text-xs">—</span>}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs">
                        <span
                          style={{
                            color: r.margin < 1000 ? "#F43F5E" : r.margin > 50000 ? "#22C55E" : "#D1D5DB",
                          }}
                        >
                          {r.margin.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-600 py-6 text-xs">
                        No constituencies match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div className="text-center text-[11px] text-gray-700 mt-6 pb-2">
          Source: clean_dim_constituency &middot; clean_fact_results_2021 &middot; clean_fact_results_2026 — atliq_election.db
        </div>
      </div>
    </div>
  );
}
