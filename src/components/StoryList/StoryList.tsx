import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Center,
  CloseButton,
  Group,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconAlertTriangle, IconClock, IconFlame, IconSearch, IconSearchOff } from "@tabler/icons-react";
import { fetchPosts, setSortMode, SortMode } from "../../features/post/postSlice";
import { selectSortedPosts, useAppDispatch, useAppSelector } from "../../store/hooks";
import { getDomain } from "../../lib/format";
import { StoryCard, StoryCardSkeleton } from "../StoryCard/StoryCard";

const REFRESH_INTERVAL = 60_000;

export function StoryList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectSortedPosts);
  const isFetching = useAppSelector((state) => state.post.isFetching);
  const error = useAppSelector((state) => state.post.error);
  const sortMode = useAppSelector((state) => state.post.sortMode);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 150);

  useEffect(() => {
    if (posts.length === 0) dispatch(fetchPosts());
    const interval = setInterval(() => dispatch(fetchPosts()), REFRESH_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const ranked = posts.map((post, index) => ({ post, rank: index + 1 }));
    if (!q) return ranked;
    return ranked.filter(({ post }) =>
      [post.title, post.by, getDomain(post.url)].some((field) => field?.toLowerCase().includes(q))
    );
  }, [posts, debouncedQuery]);

  const showSkeleton = isFetching && posts.length === 0;

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" gap="md">
        <div>
          <Title order={1} fz={{ base: 26, sm: 32 }}>
            {sortMode === "top" ? "Top stories" : "Newest stories"}
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            The {posts.length || 100} hottest stories on Hacker News, refreshed every minute.
          </Text>
        </div>
        <SegmentedControl
          value={sortMode}
          onChange={(value) => dispatch(setSortMode(value as SortMode))}
          data={[
            {
              value: "top",
              label: (
                <Center style={{ gap: 6 }}>
                  <IconFlame size={16} stroke={1.75} />
                  <span>Top</span>
                </Center>
              ),
            },
            {
              value: "new",
              label: (
                <Center style={{ gap: 6 }}>
                  <IconClock size={16} stroke={1.75} />
                  <span>New</span>
                </Center>
              ),
            },
          ]}
        />
      </Group>

      <TextInput
        size="md"
        placeholder="Search by title, author or site"
        leftSection={<IconSearch size={18} stroke={1.75} />}
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        rightSection={query && <CloseButton aria-label="Clear search" onClick={() => setQuery("")} />}
      />

      {error && (
        <Alert color="red" variant="light" icon={<IconAlertTriangle />} title="Couldn't load stories">
          <Group justify="space-between">
            <Text size="sm">{error}</Text>
            <Button size="xs" color="red" variant="light" onClick={() => dispatch(fetchPosts())}>
              Try again
            </Button>
          </Group>
        </Alert>
      )}

      <Stack gap="sm">
        {showSkeleton
          ? Array.from({ length: 10 }, (_, index) => <StoryCardSkeleton key={index} />)
          : filtered.map(({ post, rank }) => <StoryCard key={post.id} post={post} rank={rank} />)}
      </Stack>

      {!showSkeleton && posts.length > 0 && filtered.length === 0 && (
        <Stack align="center" gap="xs" py="xl">
          <ThemeIcon size={48} radius="xl" variant="light" color="gray">
            <IconSearchOff size={24} />
          </ThemeIcon>
          <Text fw={600}>Nothing found</Text>
          <Text size="sm" c="dimmed">
            No stories match &ldquo;{debouncedQuery}&rdquo;.
          </Text>
        </Stack>
      )}
    </Stack>
  );
}
