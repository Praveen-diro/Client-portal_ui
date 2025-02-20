"use client";

import { motion } from "framer-motion";
import { Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function OrganizationSection() {
  const transitionConfig = {
    type: "spring",
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
    mass: 1,
  };

  const formContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        staggerDirection: 1,
        when: "beforeChildren",
      },
    },
  };

  const formItem = {
    hidden: { opacity: 0, x: 200 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 40,
        damping: 20,
        mass: 1,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transitionConfig}
      className="w-full space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...transitionConfig, delay: 0.1 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight">Preferences</h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...transitionConfig, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Logo Section */}
        <div className="flex items-start gap-8">
          <div className="w-[200px] h-[200px] bg-muted rounded-lg flex items-center justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_dirosvg-SlKV6MwAd8fixuyjmkq61ZTjUPmRnk.png"
              alt="Organization logo"
              className="max-w-[150px] max-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                Change Logo
              </Button>
              <Button variant="outline" size="sm">
                See how it looks
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Maximum logo size 2 MB only jpeg, jpg, png, svg types allowed and minimum dimension 100x100.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Organization Details */}
      <motion.div variants={formContainer} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={formItem} className="space-y-4">
          {/* <h3 className="text-base font-semibold">Organization</h3> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <motion.div variants={formItem} className="space-y-1.5">
              <Label htmlFor="org-name">Organization</Label>
              <Input id="org-name" value="diro" className="h-9 w-full" readOnly />
            </motion.div>
            <motion.div variants={formItem} className="space-y-1.5">
              <Label htmlFor="display-name">Organization display name</Label>
              <Input id="display-name" className="h-9 w-full" placeholder="Enter display name" />
            </motion.div>
            <motion.div variants={formItem} className="space-y-1.5">
              <Label htmlFor="reg-number">Registration number</Label>
              <Input id="reg-number" className="h-9 w-full" placeholder="Enter registration number" />
            </motion.div>
            <motion.div variants={formItem} className="space-y-1.5">
              <Label htmlFor="org-type">Organization type</Label>
              <Select>
                <SelectTrigger id="org-type" className="h-9 w-full">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="non-profit">Non-Profit</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div variants={formItem} className="space-y-1.5">
              <Label htmlFor="website">Website URL</Label>
              <Input id="website" type="url" className="h-9 w-full" placeholder="Enter website URL" />
            </motion.div>
            <motion.div variants={formItem} className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Select>
                <SelectTrigger id="country" className="h-9 w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="af">Afghanistan</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </motion.div>

        {/* Color and HMAC Key Section */}
        <motion.div variants={formItem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <motion.div variants={formItem} className="space-y-1.5">
              <Label htmlFor="color">Color</Label>
              <Input id="color" className="h-9 w-full" placeholder="Enter color name or code" />
              <p className="text-xs text-muted-foreground">*Do not select white color/code.</p>
            </motion.div>
            <motion.div variants={formItem} className="space-y-1.5">
              <Label htmlFor="hmac-key">HMAC Key</Label>
              <div className="flex gap-2 w-full">
                <Input id="hmac-key" placeholder="Add key" className="h-9 flex-1" />
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">*Spaces are not allowed in the HMAC Key</p>
              <p className="text-xs text-muted-foreground">NOTE: Required to retrieve sensitive customer documents</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Billing Details */}
        <motion.div variants={formItem} className="space-y-4">
          <h3 className="text-base font-semibold">Billing details</h3>
          <div className="w-full">
            <Textarea placeholder="Enter billing details" className="min-h-[80px] resize-none w-full" />
          </div>
        </motion.div>

        <motion.div variants={formItem} className="flex justify-end pt-4">
          <Button size="sm">Save profile</Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
