import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { WHATSAPP_URL } from "@/config/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Bot, User, ExternalLink
} from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const FAQ_EN: Record<string, string> = {
  "price|cost|how much|baht": "Our fixed prices:\n\n• **BKK Airport → Pattaya:** ฿1,500\n• **DMK Airport → Pattaya:** ฿1,800\n• **Bangkok City → Pattaya:** ฿1,500\n• **Pattaya → Bangkok:** ฿1,500\n\nAll prices are fixed — no hidden fees!",
  "time|long|duration|hour": "The trip takes approximately **1.5 – 2.5 hours** depending on traffic conditions. We recommend booking early morning or late evening for the fastest trips.",
  "airport|pickup|terminal": "Yes! We offer **airport pickup** at both Suvarnabhumi (BKK) and Don Mueang (DMK) airports. Our driver will meet you at the arrival hall with a name sign.",
  "book|reserve|tomorrow|today": "You can book anytime! Simply fill out the booking form on this page, or chat with us directly on WhatsApp for instant confirmation.",
  "luggage|bag|suitcase": "Our vehicles can accommodate **2-4 large suitcases** depending on the vehicle type. If you have extra luggage, please let us know in advance.",
  "safe|driver|english": "All our drivers are **professional, licensed, and English-speaking**. Your safety and comfort are our top priorities.",
  "cancel|refund": "You can cancel your booking **up to 24 hours before** the scheduled pickup time for a full refund. Contact us via WhatsApp for cancellations.",
  "pay|payment|card|cash": "We accept **cash (THB)** and can arrange other payment methods. Payment is made directly to the driver after your trip.",
};

const FAQ_TH: Record<string, string> = {
  "ราคา|เท่าไ|บาท|จ่าย": "ราคาคงที่ของเรา:\n\n• **สนามบินสุวรรณภูมิ → พัทยา:** ฿1,500\n• **สนามบินดอนเมือง → พัทยา:** ฿1,800\n• **กรุงเทพ → พัทยา:** ฿1,500\n• **พัทยา → กรุงเทพ:** ฿1,500\n\nราคาคงที่ ไม่มีค่าใช้จ่ายแอบแฝง!",
  "เวลา|นาน|ชั่วโมง|กี่": "ใช้เวลาเดินทางประมาณ **1.5 – 2.5 ชั่วโมง** ขึ้นอยู่กับสภาพการจราจร แนะนำจองช่วงเช้าตรู่หรือค่ำเพื่อการเดินทางที่เร็วที่สุด",
  "สนามบิน|รับ|เทอร์มินัล": "รับได้ครับ! เรามีบริการ **รับที่สนามบิน** ทั้งสุวรรณภูมิ (BKK) และดอนเมือง (DMK) คนขับจะรอรับที่ห้องโถงผู้โดยสารขาเข้าพร้อมป้ายชื่อ",
  "จอง|พรุ่งนี้|วันนี้": "จองได้ตลอดเวลาครับ! กรอกฟอร์มจองบนหน้านี้ หรือแชทกับเราผ่าน WhatsApp เพื่อยืนยันทันที",
  "กระเป๋า|สัมภาระ": "รถของเรารองรับ **กระเป๋าใบใหญ่ 2-4 ใบ** ขึ้นอยู่กับประเภทรถ หากมีสัมภาระพิเศษ กรุณาแจ้งล่วงหน้า",
  "ปลอดภัย|คนขับ|อังกฤษ": "คนขับทุกคนเป็น **มืออาชีพ มีใบอนุญาต พูดอังกฤษได้** ความปลอดภัยและความสะดวกสบายของคุณคือสิ่งสำคัญที่สุด",
  "ยกเลิก|คืนเงิน": "ยกเลิกได้ **ล่วงหน้า 24 ชั่วโมง** ก่อนเวลารับ คืนเงินเต็มจำนวน ติดต่อเราผ่าน WhatsApp เพื่อยกเลิก",
  "จ่าย|ชำระ|บัตร|เงินสด": "เรารับ **เงินสด (บาท)** และสามารถจัดเตรียมวิธีชำระเงินอื่นได้ ชำระเงินให้คนขับโดยตรงหลังเดินทางเสร็จ",
};

const SUGGESTED_PROMPTS_EN = [
  "How much from airport to Pattaya?",
  "How long is the trip?",
  "Do you have airport pickup?",
  "Can I book for tomorrow?",
];

const SUGGESTED_PROMPTS_TH = [
  "ราคาจากสนามบินไปพัทยาเท่าไหร่?",
  "ใช้เวลาเดินทางนานแค่ไหน?",
  "รับที่สนามบินได้ไหม?",
  "จองพรุ่งนี้ได้ไหม?",
];

function findAnswer(question: string, lang: "en" | "th"): string {
  const faq = lang === "th" ? FAQ_TH : FAQ_EN;
  const q = question.toLowerCase();

  for (const [keywords, answer] of Object.entries(faq)) {
    const patterns = keywords.split("|");
    if (patterns.some((p) => q.includes(p))) {
      return answer;
    }
  }

  return lang === "th"
    ? "ขอบคุณสำหรับคำถามครับ! สำหรับรายละเอียดเพิ่มเติม กรุณาติดต่อเราผ่าน WhatsApp โดยตรง เรายินดีช่วยเหลือครับ 😊"
    : "Thank you for your question! For more details, please contact us directly on WhatsApp. We're happy to help! 😊";
}

export function ChatWidget({
  lang = "en",
  defaultOpen = false,
}: {
  lang?: "en" | "th";
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = lang === "th" ? SUGGESTED_PROMPTS_TH : SUGGESTED_PROMPTS_EN;

  const scrollToBottom = () => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement;
    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSend = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const answer = findAnswer(trimmed, lang);
    const assistantMsg: ChatMessage = { role: "assistant", content: answer };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg shadow-primary/25 transition-all hover:scale-110 group"
            aria-label={lang === "th" ? "เปิดแชท" : "Open chat"}
          >
            <Bot className="w-7 h-7 text-primary-foreground" />
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-40" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-border flex flex-col bg-background"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">BKK Pattaya Assistant</p>
                  <p className="text-xs opacity-80">
                    {lang === "th" ? "ตอบทุกคำถามเรื่องบริการ" : "Ask me anything about our service"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col h-full p-4">
                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-primary opacity-50" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      {lang === "th"
                        ? "สวัสดีครับ! ถามเรื่องบริการ ราคา หรือเส้นทางได้เลย"
                        : "Hi! Ask me about our services, pricing, or routes."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="text-left text-xs rounded-lg border border-border bg-card hover:bg-accent px-3 py-2.5 transition-colors line-clamp-2"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="flex flex-col gap-3 p-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-3.5 h-3.5 text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* WhatsApp CTA after conversation */}
                    {messages.length >= 2 && (
                      <div className="mt-2">
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {lang === "th" ? "แชทกับเราผ่าน WhatsApp โดยตรง" : "Chat with us directly on WhatsApp"}
                        </a>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 p-3 border-t bg-background/80 backdrop-blur-sm shrink-0"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={lang === "th" ? "พิมพ์ข้อความ..." : "Type a message..."}
                className="flex-1 max-h-20 resize-none min-h-9 text-sm rounded-xl"
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="shrink-0 h-9 w-9 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
