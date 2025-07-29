import {fetchLocations,fetchLocation} from '../APIs/locAPIs'
import { createContext,useContext,useState,useEffect } from 'react'

export const LocContext = createContext()

export const useLocation = () => useContext(LocContext)

export function LocProvider({children}){
    const [locations, setLocations] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        const fetchAllLocations = async () => {
            setLoading(true)
            setSuccess(false)
            try {
                const data = await fetchLocations()
                setLocations(data.locations)
                setError(null)
                setSuccess(true)
                return { success: true, data: data.locations }
            } catch (error) {
                setError(error.message || 'Failed to fetch locations')
                setSuccess(false)
                return { success: false, error: error.message }
            } finally {
                setLoading(false)
            }
        }
        fetchAllLocations()
    }, [])

    const fetchOneLocation = async (location_id) => {
        setLoading(true)
        setSuccess(false)
        try {
            const data = await fetchLocation(location_id)
            setSelectedLocation(data.location)
            setError(null)
            setSuccess(true)
            return { success: true, data: data.location }
        } catch (error) {
            setError(error.message || 'Failed to fetch location')
            setSuccess(false)
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    return(
        <>
        <LocContext.Provider value={{
            locations,
            selectedLocation,
            error,
            success,
            loading,
            fetchOneLocation
        }}>
            {children}
        </LocContext.Provider>
        </>
    )
}