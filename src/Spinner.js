export const Spinner = ({animate = false}) => {
  if(!animate) return null;

  return (
    <div className="sk-chase mr-2">
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
    </div>
  )
}