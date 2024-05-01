import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';

export default async function PricingPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
  );
}

//********************************************************* */

// import { useState, useEffect } from 'react';
// import Pricing from '@/components/ui/Pricing/Pricing';
// import { createClient } from '@/utils/supabase/server';

// export default function PricingPage() {
//   const [user, setUser] = useState(null);
//   const [subscription, setSubscription] = useState(null);
//   const [products, setProducts] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const supabase = createClient();

//         const { data: userData, error: userError } = await supabase.auth.getUser();
//         if (userError) throw new Error(userError.message);
//         setUser(userData);

//         const { data: subscriptionData, error: subscriptionError } = await supabase
//           .from('subscriptions')
//           .select('*, prices(*, products(*))')
//           .in('status', ['trialing', 'active'])
//           .maybeSingle();
//         if (subscriptionError) throw new Error(subscriptionError.message);
//         setSubscription(subscriptionData);

//         const { data: productsData, error: productsError } = await supabase
//           .from('products')
//           .select('*, prices(*)')
//           .eq('active', true)
//           .eq('prices.active', true)
//           .order('metadata->index')
//           .order('unit_amount', { referencedTable: 'prices' });
//         if (productsError) throw new Error(productsError.message);
//         setProducts(productsData);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>An error occurred: {error}</p>;
//   }

//   return (
//     <Pricing
//       user={user}
//       products={products ?? []}
//       subscription={subscription}
//     />
//   );
// }
