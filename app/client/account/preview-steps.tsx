import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import preview1 from "@/public/assets/images/preview-img1.png";
import preview2 from "@/public/assets/images/preview-img2.png";
import preview3 from "@/public/assets/images/preview-img3.png";

// Add styles for the img-circle class
const imgCircleStyle = {
  borderRadius: "4px",
  objectFit: "contain" as const,
  backgroundColor: "white",
};

// Custom styles to hide the default close button
const customDialogStyles = `
  [data-no-close-button] button[class*="absolute"][class*="right-"][class*="top-"] {
    display: none !important;
  }
`;

interface PreviewStepsProps {
  isOpen: boolean;
  onClose: () => void;
  logoSrc: string;
}

export function PreviewSteps({ isOpen, onClose, logoSrc }: PreviewStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      number: "1",
      title: "Login at your bank",
      image: preview1.src,
      description: "Securely connect to your banking portal",
    },
    {
      number: "2",
      title: "Download statement",
      image: preview2.src,
      description: "Get your latest bank statement",
    },
    {
      number: "3",
      title: "Review and submit",
      image: preview3.src,
      description: "Verify and confirm your information",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {/* Add custom styles to hide close button */}
      <style jsx global>
        {customDialogStyles}
      </style>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-background max-h-[90vh]">
          <div className="flex flex-col h-full">
            {/* Custom Header with Lock Icon */}

            {/* Steps Navigation */}
            <div className="flex justify-center items-center p-4 border-b">
              <div className="w-full max-w-md flex justify-between items-center relative">
                <div className="absolute top-4 left-[2.25rem] right-[2.25rem] h-0.5 bg-muted-foreground/20" />
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center z-10 cursor-pointer ${
                      currentStep === index + 1 ? "opacity-100" : "opacity-70"
                    }`}
                    onClick={() => setCurrentStep(index + 1)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === index + 1
                          ? "bg-primary text-primary-foreground"
                          : currentStep > index + 1
                          ? "bg-primary/80 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className="text-xs mt-1">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Content */}
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="space-y-4 h-full">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  {/* <h3 className="font-medium text-lg mb-2">{steps[currentStep - 1].title}</h3>
                  <p className="text-muted-foreground mb-4">{steps[currentStep - 1].description}</p> */}

                  <div className="relative rounded-lg overflow-hidden border border-border w-full h-[400px] md:h-[500px] flex-grow">
                    <img
                      src={steps[currentStep - 1].image}
                      alt={steps[currentStep - 1].title}
                      className={`w-full h-full ${
                        currentStep === 1 ? "object-contain" : currentStep === 3 ? "object-cover" : ""
                      }`}
                      style={currentStep === 1 ? { backgroundColor: "#f8f9fa" } : {}}
                    />

                    {/* Browser header and Secure verification overlay for step 2 */}
                    {currentStep === 2 && (
                      <>
                        {/* Secure verification bar - positioned at top right corner with 400px width */}
                        <div className="absolute top-0 right-0 flex items-center justify-between bg-black h-12 px-4 w-[300px]">
                          <svg
                            className="text-white mr-3"
                            width="22"
                            height="24"
                            viewBox="0 0 22 29"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18.6966 11.6746H17.8215L17.8212 6.72827C17.8212 3.13494 14.68 0.212158 10.8186 0.212158C6.95635 0.212158 3.81482 3.13521 3.81482 6.72827V11.6746H2.93971C1.43363 11.6746 0.212402 12.8102 0.212402 14.212V25.9823C0.212402 27.3835 1.43334 28.5197 2.93971 28.5197H18.6969C20.203 28.5197 21.4245 27.3838 21.4245 25.9823V14.212C21.4245 12.8105 20.203 11.6748 18.6969 11.6748L18.6966 11.6746ZM6.26558 6.72827C6.26558 4.39224 8.3084 2.49173 10.8192 2.49173C13.3292 2.49173 15.3714 4.39231 15.3714 6.72827V11.6746H6.2658L6.26558 6.72827ZM12.2142 19.9682V23.1362C12.2142 23.853 11.5898 24.434 10.8186 24.434C10.0481 24.434 9.42359 23.8531 9.42359 23.1362V19.9682C8.7701 19.5535 8.34136 18.8551 8.34136 18.064C8.34136 16.7905 9.45065 15.7585 10.8186 15.7585C12.1868 15.7585 13.2958 16.7908 13.2958 18.064C13.2958 18.8548 12.8671 19.5527 12.2142 19.9682Z"
                              fill="white"
                            ></path>
                          </svg>
                          <span className="text-white text-md mr-1">Secure verification</span>
                          <img
                            alt="Organization logo"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "contain",
                              borderRadius: "4px",
                              marginRight: "8px",
                            }}
                            src={logoSrc}
                          />
                          <X className="text-white h-6 w-6" />
                        </div>
                      </>
                    )}

                    {/* Add only the logo to steps 1 and 3 */}
                    {currentStep === 1 && (
                      <div className="absolute" style={{ top: "2rem", left: "9rem" }}>
                        <img
                          alt="Organization logo"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            borderRadius: "4px",
                          }}
                          src={logoSrc}
                        />
                      </div>
                    )}

                    {/* Special positioning for step 3 - after the arrow */}
                    {currentStep === 3 && (
                      <div className="absolute top-[30px] right-[20px]">
                        <img
                          alt="Organization logo"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "contain",
                            borderRadius: "4px",
                          }}
                          src={logoSrc}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t bg-muted/30">
              <div className="text-sm text-muted-foreground">Powered by diro</div>
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button onClick={handlePrev} variant="outline">
                    Prev
                  </Button>
                )}
                {currentStep < steps.length ? (
                  <Button onClick={handleNext}>Next</Button>
                ) : (
                  <Button onClick={onClose}>Close</Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
