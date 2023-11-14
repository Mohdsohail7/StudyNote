import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {TiStarFullOutline, TiStarHalfOutline, TiStarOutline} from 'react-icons/ti'

function RatingStars({Review_Count, Star_Size}) {
    const [starCount, setStarCount] = useState({
        full: 0,
        half: 0,
        emprty: 0,
    })

    useEffect(() => {
        const wholeSatrs = Math.floor(Review_Count) || 0
        setStarCount({
            full: wholeSatrs,
            half: Number.isInteger(Review_Count) ? 0 : 1,
            emprty: Number.isInteger(Review_Count) ? 5 - wholeSatrs : 4 - wholeSatrs,
        })
    },[Review_Count]);

  return (
    <div className="flex gap-1 text-yellow-100">
        {[...new Array(starCount.full)].map((_, i) => {
            return <TiStarFullOutline key={i} size={Star_Size || 20} />
        })}
        {[...new Array(starCount.half)].map((_, i) => {
            return <TiStarHalfOutline key={i} size={Star_Size || 20} />
        })}
        {[...new Array(starCount.emprty)].map((_, i) => {
            return <TiStarOutline key={i} size={Star_Size || 20} />
        })}
    </div>
  )
}

export default RatingStars