import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import PlanCard from '../components/user/PlanCard';

export default function Plans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/subscriptions/plans').then(res => setPlans(res.data)).finally(() => setLoading(false));
  }, []);

  const subscribe = async (planId) => {
    if (!user) return toast.error('Please sign in first');
    try {
      const res = await api.post('/subscriptions/subscribe', { plan_id: planId });
      toast.success(`Subscribed to ${res.data.plan}!`);
    } catch { toast.error('Subscription failed'); }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Choose Your Plan</h1>
        <p className="text-slate-400">Unlock the full KHOLFLIX experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSubscribe={subscribe} />
        ))}
      </div>
    </div>
  );
}
