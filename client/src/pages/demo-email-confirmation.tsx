import { useEffect } from "react";
import { CheckCircle2, Calendar, Clock, Users, MapPin } from "lucide-react";
import indexFlowLogo from "@assets/image_1771351451425.png";

export default function DemoEmailConfirmation() {
  useEffect(() => {
    document.title = "Email Confirmation Demo - indexFlow";
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
      <div className="w-[480px] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-primary p-5 flex items-center gap-4">
            <img src={indexFlowLogo} alt="indexFlow" className="h-12" />
            <div>
              <p className="text-primary-foreground font-semibold text-lg">Email Confirmation</p>
              <p className="text-primary-foreground/70 text-sm">Automated appointment notification</p>
            </div>
          </div>
        
        <div className="p-6">
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">indexFlow Office</span>
              <span className="text-xs text-gray-500">2:34 PM</span>
            </div>
            <p className="text-sm text-gray-600">Your Appointment is Confirmed!</p>
          </div>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">Appointment Confirmed!</h2>
              <p className="text-gray-600 mt-1">Thank you for your appointment, John</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">Saturday, February 8th, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">7:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Attendees</p>
                  <p className="font-medium">4 attendees</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium">123 Main Street, New York, NY</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-white py-2 px-4 rounded-md text-sm font-medium">
                Add to Calendar
              </button>
              <button className="flex-1 border border-gray-300 py-2 px-4 rounded-md text-sm font-medium">
                Modify Appointment
              </button>
            </div>
            
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-400">powered by <span className="underline">indexFlow</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
