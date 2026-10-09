import { Link } from "react-router-dom";
import {
  ActionIcon,
  Container,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconFlame, IconMoon, IconRefresh, IconSun } from "@tabler/icons-react";
import { fetchPosts } from "../../features/post/postSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { timeAgo } from "../../lib/format";

export function Header() {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector((state) => state.post.isFetching);
  const lastUpdated = useAppSelector((state) => state.post.lastUpdated);
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });
  const isDark = colorScheme === "dark";

  return (
    <Container size="md" h="100%">
      <Group h="100%" justify="space-between" wrap="nowrap">
        <UnstyledButton component={Link} to="/" aria-label="OAO News home">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon
              size={38}
              radius="md"
              variant="gradient"
              gradient={{ from: "brand.4", to: "brand.8", deg: 135 }}
            >
              <IconFlame size={22} stroke={2} />
            </ThemeIcon>
            <div>
              <Text fw={800} size="lg" lh={1.1}>
                ANV News
              </Text>
              <Text size="xs" c="dimmed" lh={1.2} visibleFrom="xs">
                Hacker News, without the noise
              </Text>
            </div>
          </Group>
        </UnstyledButton>

        <Group gap="xs" wrap="nowrap">
          <Tooltip label={lastUpdated ? `Updated ${timeAgo(lastUpdated / 1000)}` : "Refresh stories"}>
            <ActionIcon
              variant="default"
              size="lg"
              loading={isFetching}
              onClick={() => dispatch(fetchPosts())}
              aria-label="Refresh stories"
            >
              <IconRefresh size={18} stroke={1.75} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={isDark ? "Light mode" : "Dark mode"}>
            <ActionIcon
              variant="default"
              size="lg"
              onClick={() => setColorScheme(isDark ? "light" : "dark")}
              aria-label="Toggle color scheme"
            >
              {isDark ? <IconSun size={18} stroke={1.75} /> : <IconMoon size={18} stroke={1.75} />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Container>
  );
}
