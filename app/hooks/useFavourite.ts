import axios from 'axios'
import { useRouter } from 'next/navigation'
import { SafeUser } from '../types'
import useLoginModal from './useLoginModal'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-hot-toast'

interface IUserFavourite {
  listingId: string
  currentUser?: SafeUser | null
}

const useFavourite = ({ listingId, currentUser }: IUserFavourite) => {
  const router = useRouter()
  const loginModal = useLoginModal()

  const hasFavourite = useMemo(() => {
    const list = currentUser?.favouriteIds || []
    
    return list.includes(listingId)
  }, [currentUser, listingId])

  const toggleFavourite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    if (!currentUser) {
      return loginModal.onOpen()
    }

    try {
      let request

      if (hasFavourite) {
        request = () => axios.delete(`/api/favourites/${listingId}`)
      } else {
        request = () => axios.post(`/api/favourites/${listingId}`)
      }

      await request()
      router.refresh()
      toast.success('Success')
    } catch(e) {
      toast.error('Something went wrong.')
    }
  }, [currentUser, hasFavourite, listingId, router, loginModal])

  return {hasFavourite, toggleFavourite}
}

export default useFavourite
