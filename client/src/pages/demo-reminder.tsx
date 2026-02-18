import { useEffect } from "react";
import { Bell, Calendar, Clock, Users, MapPin, CheckCircle2 } from "lucide-react";
import indexFlowLogo from "@assets/image_1771351451425.png";

export default function DemoReminder() {
  useEffect(() => {
    document.title = "Reminder Message Demo - indexFlow";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-primary p-5 flex items-center gap-4">
            <img src={indexFlowLogo} alt="indexFlow" className="h-12" />
            <div>
              <p className="text-primary-foreground font-semibold text-lg">Appointment Reminder</p>
              <p className="text-primary-foreground/70 text-sm">Automated appointment reminder</p>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-sm p-4">
                <p className="font-semibold mb-2 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">Reminder: Appointment Tomorrow!</p>
                <p className="text-sm text-gray-600 mb-3">Hi John, just a friendly reminder:</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Tomorrow, Feb 8th</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>7:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>4 attendees</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>indexFlow Office</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-200">
                  Reply CONFIRM or CANCEL
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 font-medium text-sm">
                CONFIRM
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-sm p-4">
                <p className="text-sm text-gray-700">
                  Great! Your appointment is confirmed. We look forward to seeing you tomorrow at 7:00 PM!
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-6 pb-4">
            <p className="text-xs text-center text-gray-400">powered by <span className="underline">indexFlow</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
