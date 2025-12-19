import { CallIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export const ContactAdmin = () => {
  return (
  <div className=" rounded-xl  text-center">
                <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                  Contact Admin
                </h2>

                <p className="text-slate-500 text-sm font-roboto">
                  Operator passwords can only be reset by an administrator.
                </p>

                <div className="pt-4 space-y-2 mt-4">
                  <p className="text-sm font-medium text-slate-600">
                    Admin Contact No.
                  </p>

                <div className="flex justify-center items-center gap-2 text-black-600 font-semibold underline">
                    <CallIcon  className="w-4 h-4" /> +1 (234) 567-890
                </div>  

                  <p className=" text-slate-500 font-roboto font-medium">
                    Available Mon–Fri, 9AM–6PM
                  </p>
                </div>

                <div className="border-t pt-4 mt-5">
                  <p className="text-sm text-slate-500">
                    Or send a request
                  </p>

                  <textarea
                    placeholder="Reason for reset (optional)"
                    className="w-full h-24 border border-slate-200 rounded-md p-3 mt-4 text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 mt-5">
                    Continue →
                </Button>

                <div className="text-sm text-slate-500 mt-4">
                  Need help connecting?{" "}
                  <a href="#" className="text-blue-600 underline">
                    View connection guide
                  </a>
                </div>
              </div>
  );
};
