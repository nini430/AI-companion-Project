import SubscriptionButton from "@/components/subscription-button";
import checkSubscription from "@/lib/subscription"

const Settings = async() => {
    const isPro=await checkSubscription();
  return (
    <div className="h-full p-8 space-y-2">
        <h3 className="text-xl font-bold">Settings</h3>
        <p className="text-muted-foreground">You are now on a {isPro?'Premium':'Free'} Plan</p>
        <SubscriptionButton isPro={isPro} />
    </div>
  )
}

export default Settings