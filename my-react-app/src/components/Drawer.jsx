import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
export default function DrawerScrollableContent({
  children,
  id,
  title,
  mood,
  date,
  content,
  handleToggle,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        handleToggle?.();
      }}
      modal
      dismissible={false}
    >
      <DrawerTrigger asChild>
        <Button
          className="appearance-none border-none bg-transparent text-blue-500 hover:bg-transparent focus:outline-none"
          onClick={(e) => {
            e.currentTarget.blur();
          }}
        >
          {children}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{`${mood} - ${date}`}</DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar overflow-y-auto px-4">{content}</div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false); 
                handleToggle?.();
              }}
            >
              Show less
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
