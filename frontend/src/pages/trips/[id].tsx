import { useParams } from 'react-router-dom'

export const TripDetailsPage = () => {
  const { id } = useParams()
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold">Trip Details</h1>
      <p className="text-muted-foreground mt-2">Viewing trip: {id}</p>
    </div>
  )
}
