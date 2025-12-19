import { Button } from "@/components/ui/button";

interface Props {
  goToView: (view: "forgotPassword") => void;
}

export const EmailSent = ({ goToView }: Props) => {
  return (
   <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 33C26.2843 33 33 26.2843 33 18C33 9.71573 26.2843 3 18 3C9.71573 3 3 9.71573 3 18C3 26.2843 9.71573 33 18 33Z" stroke="#047857" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.5 18L16.5 21L22.5 15" stroke="#047857" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </div>
              </div>

              <h2 className="text-3xl font-semibold mb-2">
                Check your email
              </h2>
              <p className="font-roboto font-medium text-[#475569]">A passowrd reset link has been sent to admin@company</p>

              <p className="text-slate-500 text-sm mb-6 font-roboto mt-4">
                Didn't receive the email? Check your spam folder or try again.{" "}
              </p>

              <Button
                variant="outline"
                className="font-roboto font-semibold border-0"
              >
                Send again
              </Button>

                <div className="text-center mt-6 border-t pt-5">
                  <span className="text-sm font-roboto font-medium">Need help connecting? </span>
                  <a href="#" className="text-blue-700 text-sm underline">View connection guide</a>
                </div>
            </div>
  );
};
