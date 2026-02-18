import { useEffect } from "react";
import { CheckCircle2, Calendar, Clock, Users, MapPin } from "lucide-react";
import indexFlowLogo from "@assets/image_1771351451425.png";

export default function DemoSmsConfirmation() {
  useEffect(() => {
    document.title = "SMS Confirmation Demo - indexFlow";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-primary p-5 flex items-center gap-4">
            <img src={indexFlowLogo} alt="indexFlow" className="h-12" />
            <div>
              <p className="text-primary-foreground font-semibold text-lg">SMS Confirmation</p>
              <p className="text-primary-foreground/70 text-sm">Automated booking notification</p>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-2xl rounded-tl-sm p-4">
                <p className="font-semibold mb-2 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">Booking Confirmed!</p>
                <p className="text-sm text-gray-600 mb-3">Hi John, your reservation is confirmed:</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Saturday, Feb 8th</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>7:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>4 guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>The Italian Kitchen</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-200">
                  Reply CANCEL to cancel or MODIFY to change
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
