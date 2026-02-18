import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Calendar, Bot } from "lucide-react";

export default function WidgetDemo() {
  return (
    <div className="min-h-screen flex flex-col" data-testid="page-widget-demo">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-widget-demo-title">AI Assistant Widget Demo</h1>
            <p className="text-lg text-muted-foreground">Experience our intelligent assistant in action.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card data-testid="card-chat-demo">
              <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Chat Widget</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground mb-4">Our AI chat widget handles client inquiries, captures leads, and answers common questions 24/7.</p><Button data-testid="button-try-chat">Try Chat Demo</Button></CardContent>
            </Card>
            <Card data-testid="card-voice-demo">
              <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5" /> Voice Assistant</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground mb-4">AI-powered phone system that captures leads and handles calls when staff are busy.</p><Button data-testid="button-try-voice">Try Voice Demo</Button></CardContent>
            </Card>
            <Card data-testid="card-calendar-demo">
              <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Calendar Integration</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground mb-4">Real-time availability synced with your scheduling system for accurate appointments.</p><Button data-testid="button-try-calendar">Try Calendar Demo</Button></CardContent>
            </Card>
            <Card data-testid="card-ai-demo">
              <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5" /> AI Concierge</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground mb-4">Smart recommendations, service suggestions, and personalized client experiences.</p><Button data-testid="button-try-ai">Try AI Demo</Button></CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
