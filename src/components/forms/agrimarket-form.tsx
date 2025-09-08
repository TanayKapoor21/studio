'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileSignature } from 'lucide-react';

const formSchema = z.object({
  buyerName: z.string().min(2, 'Buyer name is required.'),
  cropName: z.string().min(2, 'Crop name is required.'),
  quantity: z.string().min(1, 'Quantity is required.'),
  price: z.string().min(1, 'Price is required.'),
  contractTerms: z.string().min(10, 'Please specify contract terms.'),
});

export function AgriMarketForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [contractId, setContractId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyerName: '',
      cropName: '',
      quantity: '',
      price: '',
      contractTerms: 'Payment upon delivery. Quality check to be performed by a neutral third party.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setContractId(null);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newContractId = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setContractId(newContractId);

    toast({
      title: 'Contract Created!',
      description: `Your digital contract with ${values.buyerName} has been recorded on the blockchain.`,
    });

    setIsLoading(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Digital Contract</CardTitle>
          <CardDescription>
            Fill in the details to create a secure, blockchain-backed contract.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="buyerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyer&apos;s Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Global Food Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cropName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Basmati Rice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="flex gap-4">
                 <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Quantity (in Quintals)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Price per Quintal (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 3000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
              <FormField
                control={form.control}
                name="contractTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Terms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Specify payment terms, delivery conditions, etc."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating on Blockchain...
                  </>
                ) : (
                  <>
                    <FileSignature className="mr-2 h-4 w-4" />
                    Create Secure Contract
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
          <CardDescription>
            Your generated contract information will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {contractId && (
            <div className="space-y-4 text-sm">
               <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Status
                </h3>
                <p className="rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                  Contract successfully created and recorded on-chain.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Blockchain Contract ID
                </h3>
                <p className="break-all rounded-md bg-muted p-4 font-mono text-xs text-muted-foreground">
                  {contractId}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Next Steps
                </h3>
                <p className="text-muted-foreground">
                 An escrow account has been initiated. Funds will be released upon successful delivery and verification. Both parties can track the status on their dashboard.
                </p>
              </div>
            </div>
          )}
          {!isLoading && !contractId && (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card-foreground/5 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/50">
                <FileSignature className="h-8 w-8 text-accent-foreground" />
              </div>
              <p className="text-muted-foreground">
                Your secure contract details will be displayed here once created.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
