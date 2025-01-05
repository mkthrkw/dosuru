type Props = {
  children: React.ReactNode,
  onClick?: () => void,
}

export function AsideButton({ children, onClick }: Props) {

  return (
    <button className="btn btn-outline w-full text-base-100 border-base-100" onClick={onClick}>
      {children}
    </button>
  )
}