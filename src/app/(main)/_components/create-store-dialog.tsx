import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateStoreDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CreateStoreDialog = ({
  open,
  setOpen,
}: CreateStoreDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new store</DialogTitle>
          <DialogDescription>
            Give your store a unique name. You can change this later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="shop-name">Shop Name</Label>
            <Input id="shop-name" placeholder="e.g. FreshMart, PixelHub..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
