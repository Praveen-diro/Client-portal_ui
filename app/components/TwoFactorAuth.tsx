import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

export function TwoFactorAuth() {
  const [method, setMethod] = useState<string>("authenticator");
  const [verificationCode, setVerificationCode] = useState<string>("");

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Two-Factor Authentication</h2>
        <p className="text-muted-foreground">Enhance your account security with 2FA</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Authentication Method
          </label>
          <Select value={method} onValueChange={(value) => setMethod(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select authentication method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="authenticator">Authenticator App</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-64 h-64 border-2 border-dashed rounded-lg p-2 flex items-center justify-center">
              {/* Replace with actual QR code */}
              <div className="w-48 h-48 bg-black rounded-lg" />
            </div>
            <p className="text-sm text-muted-foreground text-center">Scan this QR code with your authentication app</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Verification Code
            </label>
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-wider"
            />
          </div>

          <Button className="w-full" size="lg">
            Enable 2FA
          </Button>
        </div>
      </div>
    </Card>
  );
}
