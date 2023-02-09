import { useEffect, useRef } from "react"
import style from "./check.module.scss"

type CheckProp = {
  positionX: number,
  positionY: number
}

const Check = (prop: CheckProp) => {
  const checkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (checkRef.current) {
      // checkRef.current.style.transform = `translate(${prop.positionX * 2 * 1.2 * 16 + 2 + 0.1 * 16}px, ${prop.positionY * 2 * 1.2 * 16 + 2 + 0.1 * 16}px)`
      checkRef.current.style.left = `${prop.positionX * 2 * 1.2 * 16 + 2 + 0.1 * 16}px`
      checkRef.current.style.top = `${prop.positionY * 2 * 1.2 * 16 + 2 + 0.1 * 16}px`
    }
  }, [prop.positionX, prop.positionY])

  return (
    <div className={style.checker} ref={checkRef}></div>
  )
}

export default Check