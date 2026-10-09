import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  TypographyStylesProvider,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBrandYcombinator,
  IconChevronUp,
  IconClock,
  IconExternalLink,
  IconMessageCircle,
  IconMessageCircleOff,
  IconMoodSad,
  IconRefresh,
  IconWorld,
} from "@tabler/icons-react";
import type { Post } from "../../features/post/postSlice";
import { useAppSelector } from "../../store/hooks";
import { fetchItem } from "../../lib/api";
import { fullDate, getDomain, pluralize, timeAgo } from "../../lib/format";
import { useItems } from "../../lib/useItems";
import { CommentItem } from "../CommentItem/CommentItem";

export function StoryPage() {
  const storyId = Number(useParams().id);
  const storedStory = useAppSelector((state) => state.post.posts.find((post) => post.id === storyId));
  // undefined = loading, null = not found
  const [story, setStory] = useState<Post | null | undefined>(storedStory);

  // Stories opened by direct link may not be in the top-100 list, so fetch them.
  useEffect(() => {
    if (storedStory) {
      setStory(storedStory);
      return;
    }
    let cancelled = false;
    setStory(undefined);
    fetchItem(storyId)
      .then((item) => !cancelled && setStory(item))
      .catch(() => !cancelled && setStory(null));
    return () => {
      cancelled = true;
    };
  }, [storyId, storedStory]);

  const comments = useItems(story?.kids, Boolean(story));

  return (
    <Stack gap="lg">
      <Button
        component={Link}
        to="/"
        variant="subtle"
        color="gray"
        leftSection={<IconArrowLeft size={16} />}
        w="fit-content"
        ml={-12}
      >
        Back to stories
      </Button>

      {story === undefined && <StorySkeleton />}
      {story === null && <NotFound />}

      {story && (
        <>
          <StoryHeader story={story} />

          <Group justify="space-between">
            <Group gap="xs">
              <Title order={2} fz="xl">
                Comments
              </Title>
              <Badge variant="light" size="lg" radius="sm">
                {story.descendants ?? 0}
              </Badge>
            </Group>
            <Tooltip label="Reload comments">
              <ActionIcon
                variant="default"
                size="lg"
                loading={comments.loading}
                onClick={comments.reload}
                aria-label="Reload comments"
              >
                <IconRefresh size={18} stroke={1.75} />
              </ActionIcon>
            </Tooltip>
          </Group>

          {comments.loading && comments.items.length === 0 ? (
            <CommentsSkeleton />
          ) : comments.items.length === 0 ? (
            <Paper withBorder radius="lg" p="xl">
              <Stack align="center" gap="xs">
                <ThemeIcon size={48} radius="xl" variant="light" color="gray">
                  <IconMessageCircleOff size={24} />
                </ThemeIcon>
                <Text fw={600}>No comments yet</Text>
                <Text size="sm" c="dimmed">
                  Be the first to start the discussion on Hacker News.
                </Text>
              </Stack>
            </Paper>
          ) : (
            <Paper withBorder radius="lg" px={{ base: "sm", sm: "lg" }} py="xs">
              {comments.items.map((comment) => (
                <CommentItem key={comment.id} comment={comment} isRoot />
              ))}
            </Paper>
          )}
        </>
      )}
    </Stack>
  );
}

function StoryHeader({ story }: { story: Post }) {
  const domain = getDomain(story.url);

  return (
    <Paper withBorder radius="lg" p={{ base: "lg", sm: "xl" }} shadow="xs">
      <Stack gap="md">
        {domain && (
          <Badge
            variant="light"
            radius="sm"
            tt="none"
            fw={500}
            leftSection={<IconWorld size={12} />}
            w="fit-content"
          >
            {domain}
          </Badge>
        )}

        <Title order={1} fz={{ base: 24, sm: 30 }} lh={1.25}>
          {story.title}
        </Title>

        <Group gap="lg" style={{ rowGap: 8 }} c="dimmed" fz="sm">
          <Group gap={8} wrap="nowrap">
            <Avatar name={story.by} color="initials" size={24} radius="xl" />
            <Text size="sm" fw={600} c="var(--mantine-color-text)">
              {story.by}
            </Text>
          </Group>
          <Group gap={4} wrap="nowrap">
            <IconChevronUp size={16} />
            {pluralize(story.score ?? 0, "point")}
          </Group>
          <Tooltip label={fullDate(story.time)}>
            <Group gap={4} wrap="nowrap">
              <IconClock size={16} />
              {timeAgo(story.time)}
            </Group>
          </Tooltip>
          <Group gap={4} wrap="nowrap">
            <IconMessageCircle size={16} />
            {pluralize(story.descendants ?? 0, "comment")}
          </Group>
        </Group>

        {story.text && (
          <TypographyStylesProvider p={0}>
            <div dangerouslySetInnerHTML={{ __html: story.text }} />
          </TypographyStylesProvider>
        )}

        <Group gap="sm" mt="xs">
          {story.url && (
            <Button
              component="a"
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              rightSection={<IconExternalLink size={16} />}
            >
              Read article
            </Button>
          )}
          <Button
            component="a"
            href={`https://news.ycombinator.com/item?id=${story.id}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            leftSection={<IconBrandYcombinator size={16} />}
          >
            Discuss on HN
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

function StorySkeleton() {
  return (
    <Paper withBorder radius="lg" p="xl">
      <Stack gap="md">
        <Skeleton height={20} width={120} />
        <Skeleton height={28} width="90%" />
        <Skeleton height={28} width="60%" />
        <Skeleton height={14} width="45%" />
        <Skeleton height={36} width={160} mt="xs" />
      </Stack>
    </Paper>
  );
}

function CommentsSkeleton() {
  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="xl">
        {Array.from({ length: 4 }, (_, index) => (
          <Stack key={index} gap="xs">
            <Group gap="xs">
              <Skeleton height={26} circle />
              <Skeleton height={12} width={120} />
            </Group>
            <Skeleton height={10} ml={34} width="92%" />
            <Skeleton height={10} ml={34} width="70%" />
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

function NotFound() {
  return (
    <Paper withBorder radius="lg" p="xl">
      <Stack align="center" gap="xs">
        <ThemeIcon size={48} radius="xl" variant="light" color="gray">
          <IconMoodSad size={24} />
        </ThemeIcon>
        <Text fw={600}>Story not found</Text>
        <Text size="sm" c="dimmed">
          It may have been deleted, or the link is wrong.
        </Text>
      </Stack>
    </Paper>
  );
}
