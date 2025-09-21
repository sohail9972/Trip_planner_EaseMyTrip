import { useParams } from 'react-router-dom'

export const DestinationPage = () => {
  const { id } = useParams()
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold">Destination</h1>
      <p className="text-muted-foreground mt-2">Explore: {id}</p>
    </div>
  )
}
