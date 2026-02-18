import { Button } from "@/components/ui/button";
import { Music, Users, Calendar, MapPin, Phone, Zap } from "lucide-react";

export default function BarVibrant() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            ELECTRIC NIGHTS
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#" className="hover:text-orange-400 transition-colors">Events</a>
            <a href="#" className="hover:text-orange-400 transition-colors">VIP</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Gallery</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Contact</a>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold">
            Get on the List
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-pink-600/20 to-purple-900/30" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1920&q=80')",
            filter: "brightness(0.4)"
          }}
        />
        <div className="relative z-10 px-6 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Zap className="w-4 h-4" /> Live DJs Every Weekend
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              WHERE THE<br />PARTY STARTS
            </h1>
            <p className="text-xl text-zinc-300 mb-8">
              The city's hottest nightlife destination. Premium drinks, world-class DJs, unforgettable nights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold px-8">
                Book VIP Table
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                View Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-b from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Music className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2">Live DJs</h3>
              <p className="text-zinc-400 text-sm">Top talent spinning every night</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 rounded-2xl">
              <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2">VIP Booths</h3>
              <p className="text-zinc-400 text-sm">Premium bottle service</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl">
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2">Event Hosting</h3>
              <p className="text-zinc-400 text-sm">Private parties & corporate</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-b from-rose-500/10 to-transparent border border-rose-500/20 rounded-2xl">
              <div className="w-14 h-14 bg-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold mb-2">VIP List</h3>
              <p className="text-zinc-400 text-sm">Skip the line, join online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">DRINKS MENU</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-orange-400 mb-4 uppercase tracking-wider">Bottle Service</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Grey Goose</span>
                  <span className="text-orange-400 font-bold">$350</span>
                </div>
                <div className="flex justify-between">
                  <span>Moët & Chandon</span>
                  <span className="text-orange-400 font-bold">$400</span>
                </div>
                <div className="flex justify-between">
                  <span>Don Julio 1942</span>
                  <span className="text-orange-400 font-bold">$450</span>
                </div>
                <div className="flex justify-between">
                  <span>Ace of Spades</span>
                  <span className="text-orange-400 font-bold">$600</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-pink-400 mb-4 uppercase tracking-wider">Signature Cocktails</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <span className="block">Electric Mule</span>
                    <span className="text-zinc-500 text-xs">Vodka, ginger, lime, LED glow</span>
                  </div>
                  <span className="text-pink-400 font-bold">$18</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="block">Neon Margarita</span>
                    <span className="text-zinc-500 text-xs">Tequila, blue curaçao, lime</span>
                  </div>
                  <span className="text-pink-400 font-bold">$16</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="block">Party Punch</span>
                    <span className="text-zinc-500 text-xs">Rum, passion fruit, citrus</span>
                  </div>
                  <span className="text-pink-400 font-bold">$15</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-purple-400 mb-4 uppercase tracking-wider">Shots & Bombs</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Jägerbomb</span>
                  <span className="text-purple-400 font-bold">$12</span>
                </div>
                <div className="flex justify-between">
                  <span>Tequila Shot</span>
                  <span className="text-purple-400 font-bold">$10</span>
                </div>
                <div className="flex justify-between">
                  <span>Fireball Shot</span>
                  <span className="text-purple-400 font-bold">$8</span>
                </div>
                <div className="flex justify-between">
                  <span>Kamikaze</span>
                  <span className="text-purple-400 font-bold">$10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">THIS WEEKEND</h2>
          <p className="text-white/90 mb-8 text-lg">DJ MARCO • Saturday 10PM • Limited spots available</p>
          <Button size="lg" className="bg-white text-pink-600 hover:bg-zinc-100 font-bold px-8">
            Get on the VIP List
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
              ELECTRIC NIGHTS
            </div>
            <p className="text-zinc-500 text-sm">The party never stops.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Hours</h4>
            <p className="text-zinc-400 text-sm">Thu: 9pm - 2am</p>
            <p className="text-zinc-400 text-sm">Fri-Sat: 9pm - 4am</p>
            <p className="text-zinc-400 text-sm">Sun-Wed: Closed</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Location</h4>
            <p className="text-zinc-400 text-sm flex items-center gap-2"><MapPin className="w-4 h-4" /> 100 Party Blvd, Vegas</p>
            <p className="text-zinc-400 text-sm flex items-center gap-2"><Phone className="w-4 h-4" /> (555) ELECTRIC</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
