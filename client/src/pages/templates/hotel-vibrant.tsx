import { Button } from "@/components/ui/button";
import { Sun, Bed, Coffee, MapPin, Phone, Heart } from "lucide-react";

export default function HotelVibrant() {
  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-500">Sunset Guest House</div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-600">
            <a href="#" className="hover:text-orange-500 transition-colors">Rooms</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Breakfast</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Local Tours</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Book a Room
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sun className="w-4 h-4" /> Family-Run B&B
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 leading-tight">
              Warmth &<br /><span className="text-orange-500">Welcome</span>
            </h1>
            <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
              A cozy home away from home. Homemade breakfast, comfortable rooms, and genuine warmth since 1985.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Check Availability
              </Button>
              <Button size="lg" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                View Rooms
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
                alt="Cozy bedroom - Hotel website template"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-zinc-900 px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2">
              <Heart className="w-5 h-5" /> Breakfast Included!
            </div>
          </div>
        </div>
      </section>

      {/* Room Types */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-zinc-900 mb-4">Our Rooms</h2>
          <p className="text-zinc-600 text-center mb-12 max-w-xl mx-auto">Each room is uniquely decorated with comfort and charm in mind.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-orange-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-zinc-900 mb-2">Garden Room</h3>
              <p className="text-zinc-600 text-sm mb-3">Queen bed, garden views, ensuite bathroom.</p>
              <p className="text-orange-600 font-bold">From $89/night</p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-zinc-900 mb-2">Sunset Suite</h3>
              <p className="text-zinc-600 text-sm mb-3">King bed, balcony with sunset views, sitting area.</p>
              <p className="text-orange-600 font-bold">From $129/night</p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center mb-4">
                <Bed className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-zinc-900 mb-2">Family Room</h3>
              <p className="text-zinc-600 text-sm mb-3">Two double beds, perfect for families. Sleeps 4.</p>
              <p className="text-orange-600 font-bold">From $149/night</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-amber-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-2">Homemade Breakfast</h3>
            <p className="text-zinc-600 text-sm">Fresh eggs, local produce, grandma's recipes. 7-10am daily.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-2">Local Tours</h3>
            <p className="text-zinc-600 text-sm">We'll help you explore the best local attractions and hidden gems.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-zinc-900 mb-2">Personal Touch</h3>
            <p className="text-zinc-600 text-sm">Family-run for 3 generations. We treat every guest like family.</p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sun className="w-4 h-4" /> Book Your Stay
            </div>
            <h2 className="text-3xl font-bold text-zinc-900">Check Availability</h2>
          </div>
          <div className="bg-orange-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Check-in Date</label>
                <div className="bg-white border border-orange-200 rounded-xl p-3">
                  <span className="text-zinc-600">Select date</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Check-out Date</label>
                <div className="bg-white border border-orange-200 rounded-xl p-3">
                  <span className="text-zinc-600">Select date</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Guests</label>
                <div className="bg-white border border-orange-200 rounded-xl p-3">
                  <span className="text-zinc-600">2 Guests</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Room</label>
                <div className="bg-white border border-orange-200 rounded-xl p-3">
                  <span className="text-zinc-600">Any Room</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-12">
                Check Availability
              </Button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-zinc-600">
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500" /> Breakfast included</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /> Free parking</div>
            <div className="flex items-center gap-2"><Coffee className="w-4 h-4 text-yellow-600" /> Free WiFi</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-orange-400 to-yellow-400">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Your Room is Waiting</h2>
          <p className="text-white/90 mb-8">Book direct for the best rates. Free parking and WiFi included.</p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
            Check Availability
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-zinc-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-bold text-orange-400 mb-4">Sunset Guest House</div>
            <p className="text-zinc-400 text-sm">Where guests become family.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Check-in / Check-out</h4>
            <p className="text-zinc-400 text-sm">Check-in: 3pm - 8pm</p>
            <p className="text-zinc-400 text-sm">Check-out: by 11am</p>
            <p className="text-zinc-400 text-sm">Late arrivals welcome with notice</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Find Us</h4>
            <p className="text-zinc-400 text-sm flex items-center gap-2"><MapPin className="w-4 h-4" /> 42 Sunset Lane, Savannah</p>
            <p className="text-zinc-400 text-sm flex items-center gap-2"><Phone className="w-4 h-4" /> (555) 234-HOME</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
