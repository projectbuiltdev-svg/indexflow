import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Mic, MicOff, Send, Bot, User, Calendar, Paperclip, Volume2, VolumeX, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import indexFlowLogo from "@assets/image_1771351451425.webp";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const mockResponses = [
  "I'd be happy to help! What can I assist you with today?",
  "Great question! Let me look into that for you. Can you tell me more about what you need?",
  "I've noted that down. Can I get your name and email to follow up?",
  "All set! Our team will reach out within 24 hours. Is there anything else I can help with?",
  "Absolutely! We offer a range of SEO and content services. Would you like to learn more about our capabilities?",
];

function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let final = "";
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }
        if (final) {
          setFinalTranscript(final);
        }
        setTranscript(final || interim);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setFinalTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // already started
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setFinalTranscript("");
  }, []);

  return { isListening, transcript, finalTranscript, isSupported, startListening, stopListening, clearTranscript };
}

function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback((text: string, messageId: number) => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes("Google") && v.lang.startsWith("en")
    ) || voices.find(v => v.lang.startsWith("en"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  }, []);

  return { isSpeaking, speakingMessageId, isSupported, speak, stop };
}

interface AIWidgetProps {
  workspaceId?: string;
  logoUrl?: string;
}

export function AIWidget({ workspaceId, logoUrl }: AIWidgetProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sentTranscriptRef = useRef(false);
  const sessionIdRef = useRef(`ws_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

  const { isListening, transcript, finalTranscript, isSupported: sttSupported, startListening, stopListening, clearTranscript } = useSpeechRecognition();
  const { isSpeaking, speakingMessageId, isSupported: ttsSupported, speak, stop: stopSpeaking } = useSpeechSynthesis();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!isListening && finalTranscript.trim() && !sentTranscriptRef.current) {
      sentTranscriptRef.current = true;
      handleSendMessage(finalTranscript.trim());
      setInputText("");
      clearTranscript();
    }
  }, [isListening, finalTranscript]);

  const handleSendMessage = async (overrideText?: string) => {
    const text = overrideText || inputText.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    if (!workspaceId) {
      setTimeout(() => {
        const randomResponse =
          mockResponses[Math.floor(Math.random() * mockResponses.length)];
        const botMessage: Message = {
          id: Date.now() + 1,
          text: randomResponse,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);

        if (autoSpeak && ttsSupported) {
          setTimeout(() => speak(randomResponse, botMessage.id), 100);
        }
      }, 1500);
      return;
    }

    try {
      const history = messages
        .filter((m) => m.id !== 1)
        .map((m) => ({
          role: m.isBot ? "assistant" : "user",
          content: m.text,
        }));

      const response = await fetch(`/api/widget/${workspaceId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          sessionId: sessionIdRef.current,
          channel: isListening || autoSpeak ? "voice" : "text",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.reply,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      if (autoSpeak && ttsSupported) {
        setTimeout(() => speak(data.reply, botMessage.id), 100);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again or contact us directly.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setShowQuickActions(false);
      sentTranscriptRef.current = false;
      if (!autoSpeak) setAutoSpeak(true);
      startListening();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleScheduleConsultation = () => {
    setShowQuickActions(false);
    const userMessage: Message = {
      id: Date.now(),
      text: "I'd like to schedule a consultation",
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: "I'd be happy to help you schedule a consultation! Please tell me:\n\n1. What date works best?\n2. What time do you prefer?\n3. What topics would you like to discuss?\n\nOr simply tell me in your own words!",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleGetStarted = () => {
    setShowQuickActions(false);
    const userMessage: Message = {
      id: Date.now(),
      text: "I'd like to get started with a consultation",
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: "Great choice! I can help you get started.\n\nPlease provide your details:\n\n1. Name\n2. Email\n3. Phone\n4. Company\n5. What service are you interested in?\n\nOur team will follow up within 24 hours.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleMenu = () => {
    setShowQuickActions(false);
    const userMessage: Message = {
      id: Date.now(),
      text: "What services do you offer?",
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: "We offer a comprehensive suite of SEO and content marketing services!\n\nHere's what we can help with:\n\n1. Keyword Research & Rank Tracking\n2. AI-Powered Content Creation\n3. Local SEO & Google Maps Optimization\n4. Technical SEO Audits\n\nWhat would you like to know more about?",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSpeakMessage = (message: Message) => {
    if (isSpeaking && speakingMessageId === message.id) {
      stopSpeaking();
    } else {
      speak(message.text, message.id);
    }
  };

  const toggleAutoSpeak = () => {
    if (autoSpeak && isSpeaking) {
      stopSpeaking();
    }
    setAutoSpeak(!autoSpeak);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50" data-testid="ai-widget-container">
        {isOpen && (
          <div 
            className="absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-3rem)] bg-background border rounded-lg shadow-2xl overflow-hidden"
            data-testid="ai-widget-panel"
          >
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="Business logo" 
                    className="h-10 w-10 rounded-md object-contain bg-white/10"
                  />
                ) : (
                  <img 
                    src={indexFlowLogo} 
                    alt="indexFlow AI Widget" 
                    className="h-10 w-auto"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs opacity-80"><strong>Help Desk</strong> 24/7</p>
                    {ttsSupported && (
                      <button
                        onClick={toggleAutoSpeak}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all border ${
                          autoSpeak 
                            ? "bg-primary-foreground/25 text-primary-foreground border-green-400/40 shadow-[0_0_8px_rgba(34,197,94,0.35)] animate-pulse" 
                            : "bg-primary-foreground/10 text-primary-foreground/70 border-green-400/25 shadow-[0_0_6px_rgba(34,197,94,0.2)] hover:bg-primary-foreground/15"
                        }`}
                        data-testid="button-toggle-auto-speak"
                      >
                        {autoSpeak ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                        <span>{autoSpeak ? "Voice" : "Voice"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setIsOpen(false);
                  if (isSpeaking) stopSpeaking();
                  if (isListening) stopListening();
                }}
                className="bg-white/20 text-primary-foreground rounded-full hover:bg-white/30"
                data-testid="button-close-widget"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                  data-testid={`message-${message.id}`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg ${
                      message.isBot
                        ? "bg-background border text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm p-3 pb-1 whitespace-pre-line">{message.text}</p>
                    {message.isBot && ttsSupported && (
                      <div className="px-3 pb-2 flex justify-end">
                        <button
                          onClick={() => handleSpeakMessage(message)}
                          className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                          data-testid={`button-speak-${message.id}`}
                        >
                          {isSpeaking && speakingMessageId === message.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                    {(!message.isBot || !ttsSupported) && (
                      <div className="pb-2" />
                    )}
                  </div>
                  {!message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-background border p-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
              {showQuickActions && !isTyping && (
                <div className="flex flex-col items-center gap-3 w-full px-4">
                  <Button
                    onClick={handleScheduleConsultation}
                    className="gap-2 bg-white hover:bg-gray-100 text-white w-48 ring-1 ring-black/10"
                    data-testid="button-quick-consultation"
                  >
                    <Calendar className="w-4 h-4 text-black" />
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent font-semibold">Talk<em className="font-bold not-italic text-red-500" style={{ WebkitTextFillColor: 'unset' }}>2</em>us</span>
                  </Button>
                  <Button
                    onClick={handleMenu}
                    className="gap-2 bg-white hover:bg-gray-100 text-white w-48 ring-1 ring-black/10"
                    data-testid="button-quick-services"
                  >
                    <Search className="w-4 h-4 text-black" />
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent font-semibold">View Services</span>
                  </Button>
                  <div className="flex flex-col items-center">
                    <Button
                      onClick={handleGetStarted}
                      className="gap-2 bg-blue-500 hover:bg-blue-600 text-white w-48"
                      data-testid="button-get-started"
                    >
                      Get Started
                    </Button>
                    <span className="text-xs text-muted-foreground mt-1">Request a free consultation</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-background">
              {isListening && (
                <div className="mb-3 flex items-center gap-2 p-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <div className="relative flex-shrink-0">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 bg-red-400 rounded-full animate-ping" />
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 flex-1">
                    {transcript ? `"${transcript}"` : "Listening... speak now"}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={stopListening}
                    className="h-6 w-6 text-red-500"
                    data-testid="button-stop-listening"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <div className="flex gap-1.5 items-center">
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleVoiceToggle}
                  className={`h-8 w-8 flex-shrink-0 ${isListening ? "animate-pulse" : ""}`}
                  data-testid="button-voice-toggle"
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {}}
                  className="h-8 w-8 flex-shrink-0"
                  data-testid="button-upload-file"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </Button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isListening ? "Listening..." : "Type a message..."}
                  disabled={isListening}
                  className="flex-1 min-w-0 px-2.5 py-1.5 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid="input-chat-message"
                />
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={!inputText.trim() || isListening}
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  data-testid="button-send-message"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                powered by <a href="https://indexflow.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">indexFlow</a>
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-end gap-3">
          {!isOpen && (
            <button
              onClick={() => {
                setIsOpen(true);
                setTimeout(() => handleScheduleConsultation(), 100);
              }}
              className="text-sm font-medium hover:bg-gray-100 transition-all flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-xl ring-1 ring-black/10"
              data-testid="button-closed-consultation"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent font-semibold">Talk<em className="font-bold not-italic text-red-500" style={{ WebkitTextFillColor: 'unset' }}>2</em>us</span>
            </button>
          )}
          <Button
            size="lg"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full shadow-[0_1px_6px_rgba(239,68,68,0.2)] transition-all duration-300 ${
              isOpen ? "rotate-0" : "hover:scale-110"
            }`}
            data-testid="button-open-widget"
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </Button>
        </div>
      </div>
    </>
  );
}
