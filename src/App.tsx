import { Providers } from "~src/Providers";
import { Router } from "~src/Router";

export default function App():JSX.Element{
  return(
    <Providers>
      <Router />
    </Providers>
  )
}