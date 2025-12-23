import { Search,Languages, Wifi, FileText, Globe, ChevronDown,Bell} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/assets/img/logo.png";
import { languages as allLanguages } from "@/components/local/translation";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAltTheme, toggleTheme } = useTheme();

  const theme = isAltTheme
    ? {
        header: "bg-[#5D6532]",
        surface: "bg-[#4C5420]",
        surfaceHover: "hover:bg-[#4F572A]",
        border: "border-[#5e513e]",
        textMuted: "text-white/80",
        searchBg: "bg-[#413e3e]",
        lightorange:"bg-[#FFB27F]",
      }
    : {
        header: "bg-[#0a1628]",
        surface: "bg-[#1a2a42]",
        surfaceHover: "hover:bg-[#121a2b]",
        border: "border-[#2a3a52]",
        textMuted: "text-white/70",
        searchBg: "bg-[#1b2335]",
        Aibuttonbg:"#FFB27F",
        lightorange:"bg-[#1D4ED8]",
      };



  return (
    <header className={`h-16 ${theme.header} flex items-center justify-between px-3 md:px-4 lg:px-6 relative sticky top-0 z-50 transition-colors duration-300`}>
      {/* Logo - Clickable to toggle theme */}
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-white font-semibold text-base md:text-lg">CamPulse</span>
          <span className={`text-white text-[10px] md:text-xs font-bold  px-1.5 py-0.5 rounded`}>
            {/* Logo Image */}
            <img
              src={Logo}
              alt="CamPulse Logo"
              className="h-9 w-auto object-contain"
            />
          </span>
        </button>
      </div>

      {/* Search - Desktop */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className={`
              pl-10 h-9 rounded-full w-full
              border border-s-violet-50
              ${theme.searchBg}
              ${theme.border}
              text-white
              placeholder:text-white/60
              focus-visible:ring-0
              focus-visible:ring-offset-0
            `}
            autoFocus
          />

        </div>
      </div>

      {/* Mobile Search Button */}
      <button 
        onClick={() => setSearchOpen(!searchOpen)}
        className="md:hidden p-2 text-white/70"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 p-3 border-b border-white/10 z-50`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-[#1a2a42] border-[#2a3a52] text-white placeholder:text-gray-400 h-9 rounded-full w-full"
              autoFocus
            />
          </div>
        </div>
      )}
{/* bg-[#1a2a42] */}
      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Device Status */}
       <div
          className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.searchBg}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.78809 0C10.5365 0.000438117 13.5752 3.03959 13.5752 6.78809C13.5748 10.5362 10.5362 13.5748 6.78809 13.5752C3.03959 13.5752 0.000438116 10.5365 0 6.78809C0 3.03932 3.03932 0 6.78809 0ZM6.78809 1.5C3.86775 1.5 1.5 3.86775 1.5 6.78809C1.50044 9.70805 3.86802 12.0752 6.78809 12.0752C9.70778 12.0748 12.0748 9.70778 12.0752 6.78809C12.0752 3.86802 9.70805 1.50044 6.78809 1.5ZM8.06836 5.0498C8.36127 4.75712 8.83608 4.75699 9.12891 5.0498C9.42153 5.34265 9.42153 5.81751 9.12891 6.11035L6.71387 8.52539C6.42094 8.81792 5.94512 8.81816 5.65234 8.52539L4.44531 7.31836C4.15255 7.02559 4.15278 6.54976 4.44531 6.25684C4.73814 5.96429 5.21303 5.9643 5.50586 6.25684L6.18262 6.93359L8.06836 5.0498Z" fill="#4ADE80"/>
          </svg>
          <span className="text-sm text-white">138 / 142 device online</span>
        </div>

        {/* AI Report Button */}
        <Button className={` ${theme.lightorange} hover:opacity-90 text-white gap-2 px-3 py-2 rounded-sm px-2 md:px-3 transition-colors duration-300`}>
           <span className="hidden sm:inline text-sm">AI Report </span>
        </Button>


        {/* 🌐 Language dropdown */}
   <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="default"
      className={`
        px-3 py-2 transition rounded-sm
        text-xs md:text-sm
        flex items-center gap-2
        ${theme.surface}
        ${theme.surfaceHover}
        ${theme.textMuted}
      `}
    >
      <Languages className="h-4 w-4" />
      ENG
      <ChevronDown className="h-4 w-4 ml-auto transition-transform" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="w-56 p-2">
    <ScrollArea className="h-40">
      {allLanguages.map((langItem) => (
        <DropdownMenuItem
          key={langItem.code}
          className={`cursor-pointer ${theme.surfaceHover}`}
        >
          {langItem.label}
        </DropdownMenuItem>
      ))}
    </ScrollArea>
  </DropdownMenuContent>
</DropdownMenu>



       {/* Notification Bell */}
   <button
        className={`
          relative px-3 py-2 rounded-sm transition
          ${theme.surface}
          ${theme.surfaceHover}
          ${theme.textMuted}
        `}
      >
         <svg width="19" height="24" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.04395 16.2081C9.25112 15.8496 9.70972 15.7266 10.0684 15.9337C10.4269 16.1408 10.5497 16.5995 10.3428 16.9581C10.1307 17.3254 9.8253 17.6308 9.45801 17.8429C9.09076 18.0548 8.67402 18.1661 8.25 18.1661C7.82596 18.1661 7.40927 18.0548 7.04199 17.8429C6.67463 17.6308 6.36934 17.3255 6.15723 16.9581C5.95013 16.5994 6.07295 16.1408 6.43164 15.9337C6.79031 15.7267 7.24895 15.8495 7.45605 16.2081C7.53651 16.3475 7.65265 16.4636 7.79199 16.5441C7.93121 16.6243 8.08929 16.6661 8.25 16.6661C8.41068 16.6661 8.56881 16.6243 8.70801 16.5441C8.84728 16.4636 8.96352 16.3474 9.04395 16.2081ZM7.39746 0.0635853C8.2998 -0.0716758 9.22226 0.00952136 10.0869 0.30089C10.4788 0.433457 10.6896 0.85891 10.5576 1.25109C10.4253 1.64335 9.99976 1.85466 9.60742 1.72276C8.96842 1.50744 8.28697 1.44707 7.62012 1.54698C6.95305 1.64708 6.31838 1.90447 5.77051 2.29796C5.22264 2.69151 4.77662 3.21044 4.46875 3.81066C4.16096 4.41081 4 5.07562 4 5.75011C3.99997 7.70285 3.69384 9.06005 3.20215 10.1007C2.71551 11.1304 2.06938 11.7952 1.51953 12.3624C1.50966 12.374 1.50344 12.3884 1.50098 12.4034C1.49847 12.4192 1.50046 12.4357 1.50684 12.4503C1.5134 12.4649 1.52469 12.4777 1.53809 12.4864C1.55141 12.495 1.56717 12.5 1.58301 12.5001H14.917L14.9629 12.4864C14.9762 12.4777 14.9867 12.4649 14.9932 12.4503C14.9996 12.4357 15.0025 12.4192 15 12.4034C14.9974 12.3878 14.9891 12.3733 14.9785 12.3614C14.7962 12.1725 14.6225 11.9741 14.459 11.7687C14.2013 11.4446 14.2551 10.9728 14.5791 10.715C14.9032 10.4572 15.3749 10.5111 15.6328 10.8351C15.7705 11.0081 15.9173 11.1745 16.0713 11.3331C16.0768 11.3388 16.0826 11.3458 16.0879 11.3517C16.2942 11.5786 16.4313 11.8605 16.4805 12.1632C16.5295 12.466 16.4893 12.7772 16.3652 13.0577C16.2411 13.3381 16.0382 13.5769 15.7812 13.7442C15.5243 13.9115 15.2236 14.0001 14.917 14.0001H1.58398C1.27742 14.0002 0.97674 13.9113 0.719727 13.7442C0.462824 13.577 0.259901 13.338 0.135742 13.0577C0.0116497 12.7772 -0.0285938 12.466 0.0205078 12.1632C0.0696556 11.8604 0.205742 11.5786 0.412109 11.3517L0.428711 11.3341C0.983087 10.7622 1.47194 10.251 1.8457 9.46007C2.21864 8.67087 2.49997 7.54591 2.5 5.75011C2.5 4.83759 2.71738 3.93805 3.13379 3.12609C3.55029 2.31408 4.15435 1.61262 4.89551 1.08019C5.63676 0.54779 6.49493 0.199007 7.39746 0.0635853ZM13.25 2.50011C15.0448 2.5002 16.5 3.95524 16.5 5.75011C16.4999 7.54489 15.0448 9.00001 13.25 9.00011C11.4551 9.00011 10.0001 7.54494 10 5.75011C10 3.95518 11.4551 2.50011 13.25 2.50011ZM13.25 4.00011C12.2835 4.00011 11.5 4.78361 11.5 5.75011C11.5001 6.71652 12.2836 7.50011 13.25 7.50011C14.2164 7.50001 14.9999 6.71646 15 5.75011C15 4.78367 14.2164 4.0002 13.25 4.00011Z" fill="#FAFAFA"/>
            </svg>
      </button>


        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-white/10">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-white">Kate Russell</p>
            <p className="text-xs text-white/60">Project Manager</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white  flex items-center justify-center overflow-hidden">
            <span className="text-sm font-semibold text-black font-roboto">KR</span>
          </div>
        </div>
      </div>
    </header>
  );
}
