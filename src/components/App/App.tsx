import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell, Container } from "@mantine/core";
import { Header } from "../Header/Header";
import { StoryList } from "../StoryList/StoryList";
import { StoryPage } from "../StoryPage/StoryPage";

function App() {
  return (
    <AppShell header={{ height: 64 }}>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="md" py="xl">
          <Routes>
            <Route path="/" element={<StoryList />} />
            <Route path="/post/:id" element={<StoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
