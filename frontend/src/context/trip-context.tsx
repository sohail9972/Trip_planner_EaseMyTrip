import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

type Trip = {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'booked' | 'completed' | 'cancelled';
  budget: number;
  travelers: number;
  theme: string;
  createdAt: string;
  updatedAt: string;
};

type TripContextType = {
  // State
  currentTrip: Trip | null;
  trips: Trip[];
  isLoading: boolean;
  isCreating: boolean;
  
  // Queries
  refetchTrips: () => Promise<void>;
  
  // Mutations
  createTrip: (tripData: Omit<Trip, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Trip>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (id: string) => Promise<void>;
  setCurrentTrip: (trip: Trip | null) => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  // Fetch trips
  const { 
    data: trips = [], 
    isLoading,
    refetch: refetchTripsQuery 
  } = useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: async () => {
      const response = await api.get('/trips');
      return response.data;
    },
    onError: (error) => {
      console.error('Failed to fetch trips:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trips. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Create trip mutation
  const { mutateAsync: createTripMutation, isPending: isCreating } = useMutation({
    mutationFn: async (tripData: Omit<Trip, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.post('/trips', tripData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast({
        title: 'Trip created',
        description: 'Your trip has been created successfully!',
      });
    },
    onError: (error) => {
      console.error('Failed to create trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to create trip. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update trip mutation
  const { mutateAsync: updateTripMutation } = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Trip> }) => {
      const response = await api.patch(`/trips/${id}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast({
        title: 'Trip updated',
        description: 'Your trip has been updated successfully!',
      });
    },
    onError: (error) => {
      console.error('Failed to update trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to update trip. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete trip mutation
  const { mutateAsync: deleteTripMutation } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/trips/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast({
        title: 'Trip deleted',
        description: 'Your trip has been deleted.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete trip. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Wrapper functions
  const refetchTrips = useCallback(async () => {
    await refetchTripsQuery();
  }, [refetchTripsQuery]);

  const createTrip = useCallback(async (tripData: Omit<Trip, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    return await createTripMutation(tripData);
  }, [createTripMutation]);

  const updateTrip = useCallback(async (id: string, updates: Partial<Trip>) => {
    return await updateTripMutation({ id, updates });
  }, [updateTripMutation]);

  const deleteTrip = useCallback(async (id: string) => {
    await deleteTripMutation(id);
  }, [deleteTripMutation]);

  const value = {
    currentTrip,
    trips,
    isLoading,
    isCreating,
    refetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    setCurrentTrip,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
