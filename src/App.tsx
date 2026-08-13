import "./App.css";
import { AppStage } from "./components/AppStage";
import { SiteShell } from "./components/SiteShell";
import { useAppController } from "./app/useAppController";

function App() {
  const { shellContext, stageProps } = useAppController();

  return (
    <SiteShell context={shellContext}>
      <AppStage {...stageProps} />
    </SiteShell>
  );
}

export default App;
