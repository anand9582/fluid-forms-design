import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

/* =========================
   ROOT
========================= */

const Drawer = ({
  shouldScaleBackground = false,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    dragEnabled={false}   
    modal={true}           
    snapPoints={[]}      
    dismissible={true}  
    {...props}
  />
);

Drawer.displayName = "Drawer";

/* =========================
   PRIMITIVES
========================= */

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

/* =========================
   OVERLAY
========================= */

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80",
      "touch-none select-none", 
      className
    )}
    {...props}
  />
));

DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

/* =========================
   CONTENT (SIDE DRAWER)
========================= */

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
    direction?: "left" | "right";
  }
>(({ className, children, direction = "right", ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />

    <DrawerPrimitive.Content
      ref={ref}
      onTouchStart={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      onTouchEnd={(e) => e.preventDefault()}
      className={cn(
        "vaul-drawer fixed inset-y-0 z-50 flex flex-col bg-white border shadow-lg",
        "touch-none select-none overscroll-contain", 
        direction === "right" && "right-0 ml-auto rounded-l-xl",
        direction === "left" && "left-0 mr-auto rounded-r-xl",
        className
      )}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));

DrawerContent.displayName = "DrawerContent";

/* =========================
   HEADER
========================= */

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-left", className)} {...props} />
);

DrawerHeader.displayName = "DrawerHeader";

/* =========================
   FOOTER
========================= */

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);

DrawerFooter.displayName = "DrawerFooter";

/* =========================
   TITLE
========================= */

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  />
));

DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

/* =========================
   DESCRIPTION
========================= */

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

DrawerDescription.displayName =
  DrawerPrimitive.Description.displayName;

/* =========================
   EXPORTS
========================= */

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
