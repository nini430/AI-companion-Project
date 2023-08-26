'use client';

import useProModal from '@/hooks/use-pro-modal';
import axios from 'axios';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { useState } from 'react';
import { useToast } from './ui/use-toast';

const ProModal = () => {
  const proModal = useProModal();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubscribe = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/stripe');
      window.location.href = response.data.url;
    } catch (err) {
      console.log('Something went wrong', err);
      toast({
        variant: 'destructive',
        description: 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade To Pro</DialogTitle>
          <DialogDescription>
            Create your own{' '}
            <span className="font-medium text-sky-500">Custom AI</span>{' '}
            companions
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between">
          <p className="font-bold text-2xl">
            $9
            <span className="text-sm font-normal">.99/mo</span>
          </p>
          <Button disabled={isLoading} onClick={onSubscribe} variant="premium">
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
