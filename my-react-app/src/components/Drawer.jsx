import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import styles from "./Card.module.css"

export default function DrawerScrollableContent({
  children,
  id,
  title,
  mood,
  date,
  content,
  handleToggle,
}) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={(nextOpen) => {
    
        if (!nextOpen) return
        setOpen(true)
      }}
    >
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={styles.btn}
          onClick={() => {
            setOpen(true)
            handleToggle?.()
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

        <div className="no-scrollbar overflow-y-auto px-4">
          {content}
        </div>

        <DrawerFooter>
       
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false)
                handleToggle?.()
              }}
            >
              Show less
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
