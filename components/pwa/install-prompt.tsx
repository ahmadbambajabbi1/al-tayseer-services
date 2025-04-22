"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Info } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

// Define the BeforeInstallPromptEvent interface properly
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPWA() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installError, setInstallError] = useState<string | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showManualInstructionsUI, setShowManualInstructionsUI] =
    useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const checkIfStandalone = () => {
      const isAppInstalled =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes("android-app://");

      setIsStandalone(isAppInstalled);
      return isAppInstalled;
    };

    if (typeof window !== "undefined") {
      // Don't show the prompt if already in standalone mode
      if (checkIfStandalone()) {
        return;
      }

      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent Chrome from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        // Show the install button
        setShowInstallPrompt(true);
        console.log("Install prompt captured and ready");
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      // Also listen for appinstalled event
      window.addEventListener("appinstalled", () => {
        console.log("PWA was installed");
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      });

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no deferred prompt is available, show manual installation UI
      setShowManualInstructionsUI(true);
      return;
    }

    setIsInstalling(true);
    setInstallError(null);

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
        setShowInstallPrompt(false);
      } else {
        console.log("User dismissed the install prompt");
        setInstallError("Installation was dismissed. Please try again.");
      }
    } catch (error) {
      console.error("Installation error:", error);
      setInstallError(
        "There was a problem installing the app. Please try again."
      );
    } finally {
      // Clear the deferredPrompt variable
      setDeferredPrompt(null);
      setIsInstalling(false);
    }
  };

  // Only show the component when there's a valid install prompt or when manually triggered
  if (!showInstallPrompt && !showManualInstructionsUI) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white p-4 shadow-lg border-t border-gray-200">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-medium">Install {APP_NAME} App</p>
          <p className="text-sm text-gray-600">
            Add to home screen for a better experience
          </p>
          {showManualInstructionsUI && (
            <div className="mt-2">
              <p className="text-sm font-medium">Manual Installation:</p>
              <ul className="text-xs text-gray-600 mt-1 list-disc pl-5">
                <li>On iOS: Tap Share ⎙ and then "Add to Home Screen"</li>
                <li>On Android: Open menu ⋮ and tap "Add to Home screen"</li>
                <li>
                  On Desktop: Look for the install icon in the address bar
                </li>
              </ul>
            </div>
          )}
          {installError && (
            <p className="text-sm text-red-500 mt-1">{installError}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowInstallPrompt(false);
              setShowManualInstructionsUI(false);
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          {showManualInstructionsUI ? (
            <Button
              variant="outline"
              onClick={() => setShowManualInstructionsUI(false)}
              className="flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              Got it
            </Button>
          ) : (
            <Button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="flex items-center gap-2"
            >
              {isInstalling ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Installing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Install App
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
