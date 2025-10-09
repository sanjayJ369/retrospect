import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";
import useDeleteChallengeMutation from "@/hooks/api/challenges/useDeleteChallengeMutation";
import { Edit2Icon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import ChallengeEdit from "./challenge-edit";
import { useState } from "react";

interface ChallengeMutateProps {
  id: string;
}

const ChallengeMutate = ({ id }: ChallengeMutateProps) => {
  const { mutate: deleteChallenge } = useDeleteChallengeMutation();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <>
      <ChallengeEdit open={isEdit} setOpen={setIsEdit} challengeId={id} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-xs w-56 rounded-none overflow-clip">
          <DropdownMenuItem
            onClick={() => {
              requestAnimationFrame(() => setIsEdit(true));
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <Edit2Icon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteChallenge(id)}>
            Delete
            <DropdownMenuShortcut>
              <Trash2Icon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ChallengeMutate;
