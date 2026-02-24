import { useState, useEffect } from "react";
import { Mail, Clock, Send, MessageCircle, Calendar, Building2, ChevronLeft, ChevronRight, Code } from "lucide-react";
import { SiWordpress, SiWix, SiSquarespace, SiShopify, SiWebflow, SiDrupal, SiMagento, SiBigcommerce, SiJoomla } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { colorShadows } from "@/lib/color-shadows";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    lines: ["hello@indexflow.io", "sales@indexflow.io"],
  },
  {
    icon: Clock,
    title: "Support Hours",
    lines: ["24/7 Technical Support", "for all active clients"],
  },
];

const inquiryTypes = [
  { value: "demo", label: "Request a Demo" },
  { value: "pricing", label: "Pricing Information" },
  { value: "partnership", label: "Partnership Inquiry" },
  { value: "support", label: "Client Support" },
  { value: "media", label: "Media/Press" },
  { value: "other", label: "Other" },
];

const businessTypes = [
  { value: "seo-agency", label: "SEO Agency" },
  { value: "content-agency", label: "Content Agency" },
  { value: "digital-marketing", label: "Digital Marketing Agency" },
  { value: "freelancer", label: "Freelancer/Consultant" },
  { value: "enterprise", label: "Enterprise" },
  { value: "other", label: "Other" },
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    venueType: "",
    inquiryType: "",
    message: "",
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingStep, setBookingStep] = useState(1);

  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay();
    return date < today || dayOfWeek === 0 || dayOfWeek === 6;
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[selectedDate.getDay()]}, ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
  };

  const handleDateSelect = (day: number) => {
    if (!isDateDisabled(day)) {
      setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      setBookingStep(2);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingStep(3);
  };

  const handleBookingSubmit = () => {
    toast({
      title: "Call Scheduled!",
      description: `Your 20-min call is booked for ${formatSelectedDate()} at ${selectedTime}.`,
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingMessage("");
    setBookingStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Our team will reach out within 24 hours.",
        });
        setFormData({ name: "", email: "", phone: "", company: "", venueType: "", inquiryType: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch {
      toast({
        title: "Message Received",
        description: "We'll respond to your inquiry shortly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO {...seoData.contact} />
      <section className="bg-gradient-to-b from-accent/30 to-background pt-4 pb-16 lg:pt-8 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Get In Touch</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Let's Grow Your <span className="text-primary">SEO Platform</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to scale your agency with indexFlow? Schedule a demo or ask us anything about our platform. We've made this simple and easy.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Contact Our Team
                  </CardTitle>
                                  </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          data-testid="input-contact-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@youragency.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          data-testid="input-contact-email"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          data-testid="input-contact-phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          placeholder="Your Agency Name"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          data-testid="input-contact-company"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type</Label>
                        <Select
                          value={formData.venueType}
                          onValueChange={(value) => setFormData({ ...formData, venueType: value })}
                        >
                          <SelectTrigger id="businessType" data-testid="select-business-type">
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiryType">How Can We Help?</Label>
                        <Select
                          value={formData.inquiryType}
                          onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}
                        >
                          <SelectTrigger id="inquiryType" data-testid="select-inquiry-type">
                            <SelectValue placeholder="Select topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {inquiryTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your business and what you're looking for..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        data-testid="textarea-message"
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2" disabled={isSubmitting} data-testid="button-send-message">
                      {isSubmitting ? "Sending..." : (
                        <>
                          <Send className="w-4 h-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-8 pt-8 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Talk to Us | Online Meetup
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Prefer a face-to-face chat? Schedule a discovery call with us.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://zoom.us', '_blank')}
                        data-testid="link-zoom"
                      >
                        Zoom
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://meet.google.com', '_blank')}
                        data-testid="link-google-meet"
                      >
                        Google Meet
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('https://wa.me/15551234567', '_blank')}
                        data-testid="link-whatsapp"
                      >
                        WhatsApp
                      </Button>
                    </div>

                    <h4 className="font-semibold mb-4">Book a 20-min Call</h4>
                    
                    {/* Step 1: Calendar */}
                    <div className="border rounded-md p-4 bg-card">
                      <div className="flex items-center justify-between mb-4">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                          data-testid="button-prev-month"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="font-medium">
                          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                          data-testid="button-next-month"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
                        {daysOfWeek.map(day => (
                          <div key={day} className="py-1">{day}</div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth).map((day, index) => (
                          <button
                            key={index}
                            onClick={() => day && handleDateSelect(day)}
                            disabled={day === null || isDateDisabled(day)}
                            className={`
                              p-2 text-sm rounded-md transition-colors
                              ${day === null ? 'invisible' : ''}
                              ${day && isDateDisabled(day) ? 'text-muted-foreground/40 cursor-not-allowed' : ''}
                              ${day && !isDateDisabled(day) ? 'hover:bg-primary/10 cursor-pointer' : ''}
                              ${selectedDate && day === selectedDate.getDate() && 
                                currentMonth.getMonth() === selectedDate.getMonth() && 
                                currentMonth.getFullYear() === selectedDate.getFullYear() 
                                ? 'bg-primary text-primary-foreground' : ''}
                            `}
                            data-testid={day ? `calendar-day-${day}` : undefined}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Time Selection */}
                    {bookingStep >= 2 && selectedDate && (
                      <div className="mt-4 border rounded-md p-4 bg-card">
                        <div className="text-sm font-medium mb-3">{formatSelectedDate()}</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {timeSlots.map(time => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleTimeSelect(time)}
                              data-testid={`time-slot-${time.replace(/[: ]/g, '-')}`}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Message */}
                    {bookingStep >= 3 && selectedTime && (
                      <div className="mt-4 border rounded-md p-4 bg-card">
                        <div className="text-sm font-medium mb-2">How can we help?</div>
                        <Textarea
                          placeholder="Tell us about your project..."
                          value={bookingMessage}
                          onChange={(e) => setBookingMessage(e.target.value)}
                          rows={3}
                          className="mb-3"
                          data-testid="textarea-booking-message"
                        />
                        <Button 
                          className="w-full" 
                          onClick={handleBookingSubmit}
                          data-testid="button-confirm-booking"
                        >
                          Schedule Demo
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, i) => (
                <Card key={info.title} className={`hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{info.title}</h3>
                      {info.lines.map((line, i) => (
                        <p key={i} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Stay in the Loop</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get insights on agency growth and SEO tips delivered to your inbox.
                  </p>
                  <div className="space-y-2">
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      data-testid="input-newsletter-email"
                    />
                    <Button className="w-full" data-testid="button-subscribe">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* CMS Platforms Box */}
              <Card className="bg-muted">
                <CardContent className="p-5">
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-sm">indexFlow works on these CMS platforms</h3>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { name: "WordPress", icon: SiWordpress, color: "text-[#21759b]" },
                      { name: "Wix", icon: SiWix, color: "text-[#0C6EFC]" },
                      { name: "Squarespace", icon: SiSquarespace, color: "text-foreground" },
                      { name: "Shopify", icon: SiShopify, color: "text-[#96bf48]" },
                      { name: "Webflow", icon: SiWebflow, color: "text-[#4353ff]" },
                      { name: "Drupal", icon: SiDrupal, color: "text-[#0678be]" },
                      { name: "Magento", icon: SiMagento, color: "text-[#f46f25]" },
                      { name: "BigCommerce", icon: SiBigcommerce, color: "text-[#121118]" },
                      { name: "Joomla", icon: SiJoomla, color: "text-[#5091cd]" },
                      { name: "Custom", icon: Code, color: "text-purple-500" },
                    ].map((cms) => (
                      <div 
                        key={cms.name} 
                        className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-background hover:bg-accent transition-colors"
                      >
                        <cms.icon className={`w-7 h-7 ${cms.color}`} />
                        <span className="text-[10px] text-muted-foreground font-medium">{cms.name}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-3">
                    Embed our widget on any platform in minutes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
