import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AlertDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const AlertDialog: React.FC<AlertDialogProps> = ({ 
  children, 
  open: controlledOpen, 
  onOpenChange 
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [isControlled, onOpenChange])

  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

interface AlertDialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AlertDialogContext = React.createContext<AlertDialogContextValue>({
  open: false,
  onOpenChange: () => {},
})

const useAlertDialog = () => React.useContext(AlertDialogContext)

const AlertDialogTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }> = ({ 
  onClick,
  children,
  asChild,
  ...props 
}) => {
  const { onOpenChange } = useAlertDialog()
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    onOpenChange(true)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      onClick: handleClick,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

const AlertDialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className,
  children,
  ...props 
}) => {
  const { open, onOpenChange } = useAlertDialog()
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        className={cn(
          "w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800",
          className
        )}
        {...props}
      >
        {children}
      </div>
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={() => onOpenChange(false)}
      />
    </div>
  )
}

const AlertDialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className,
  ...props 
}) => (
  <div
    className={cn("mb-4 text-center sm:text-left", className)}
    {...props}
  />
)

const AlertDialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className,
  ...props 
}) => (
  <div
    className={cn("mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
)

const AlertDialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  className,
  ...props 
}) => (
  <h2
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
)

const AlertDialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  className,
  ...props 
}) => (
  <p
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
)

const AlertDialogAction: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  className,
  ...props 
}) => {
  const { onOpenChange } = useAlertDialog()
  
  return (
    <Button
      onClick={() => onOpenChange(false)}
      className={className}
      {...props}
    />
  )
}

const AlertDialogCancel: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  className,
  ...props 
}) => {
  const { onOpenChange } = useAlertDialog()
  
  return (
    <Button
      variant="outline"
      onClick={() => onOpenChange(false)}
      className={cn("sm:mt-0", className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} 