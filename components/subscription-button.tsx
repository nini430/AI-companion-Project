'use client';

import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast';

interface IsubscriptuonButtonProps {
  isPro: boolean;
}

const SubscriptionButton = ({ isPro = false }: IsubscriptuonButtonProps) => {
  const [loading, setLoading] = useState(false);
  const router=useRouter();
  const {toast}=useToast();
  const onClick = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stripe');
      router.refresh();
      window.location.href = response.data.url;
    } catch (err) {
      console.log('Something went wrong', err);
      toast({
        variant:'destructive',
        description:'Something went wrong'
      })
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      size="sm"
      variant={isPro ? 'default' : 'premium'}
    >
      {isPro ? 'Manage Subscription' : 'Upgrade'}
      {!isPro && <Sparkles className="w-4 h-4" />}
    </Button>
  );
};

export default SubscriptionButton;
