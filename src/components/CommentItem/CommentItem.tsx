import { useState } from "react";
import {
  ActionIcon,
  Avatar,
  Button,
  Collapse,
  Group,
  Loader,
  Text,
  Tooltip,
  TypographyStylesProvider,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import type { Post } from "../../features/post/postSlice";
import { fullDate, pluralize, timeAgo } from "../../lib/format";
import { useItems } from "../../lib/useItems";
import classes from "./CommentItem.module.css";

interface CommentItemProps {
  comment: Post;
  isRoot?: boolean;
}

export function CommentItem({ comment, isRoot = false }: CommentItemProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const replies = useItems(comment.kids, showReplies);

  const isRemoved = comment.deleted || comment.dead || !comment.text;
  const replyCount = comment.kids?.length ?? 0;

  return (
    <div className={`${classes.comment} ${isRoot ? classes.root : ""}`}>
      <Group gap="xs" wrap="nowrap">
        <Avatar name={comment.by} color={isRemoved ? "gray" : "initials"} size={26} radius="xl">
          {isRemoved && <IconTrash size={14} />}
        </Avatar>
        <Text size="sm" fw={600} c={isRemoved ? "dimmed" : undefined} truncate>
          {comment.by ?? "[deleted]"}
        </Text>
        <Tooltip label={fullDate(comment.time)}>
          <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
            {timeAgo(comment.time)}
          </Text>
        </Tooltip>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          ml="auto"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand comment" : "Collapse comment"}
        >
          {collapsed ? <IconPlus size={14} /> : <IconMinus size={14} />}
        </ActionIcon>
      </Group>

      <Collapse in={!collapsed}>
        <div className={classes.body}>
          {isRemoved ? (
            <Text size="sm" c="dimmed" fs="italic">
              {comment.dead ? "This comment was flagged." : "This comment was deleted."}
            </Text>
          ) : (
            <TypographyStylesProvider className={classes.text} p={0}>
              <div dangerouslySetInnerHTML={{ __html: comment.text ?? "" }} />
            </TypographyStylesProvider>
          )}

          {replyCount > 0 && (
            <Button
              variant="subtle"
              size="compact-xs"
              mt={4}
              ml={-6}
              leftSection={showReplies ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
              onClick={() => setShowReplies((value) => !value)}
            >
              {showReplies ? "Hide replies" : `Show ${pluralize(replyCount, "reply", "replies")}`}
            </Button>
          )}

          {showReplies && (
            <div className={classes.replies}>
              {replies.loading && replies.items.length === 0 ? (
                <Loader size="xs" type="dots" my="xs" />
              ) : (
                replies.items.map((reply) => <CommentItem key={reply.id} comment={reply} />)
              )}
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
}
