import { Project } from "@/src/types";
import { motion } from "framer-motion";
import { Clock, Folder, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ElementType } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { iconMap } from "../modals/create-project-modal";

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const router = useRouter();
  const ProjectIcon = iconMap[project.icon] || Folder;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/projects/${project.id}`}>
        <Card className="group border-none h-full cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all duration-200 overflow-hidden">
          <div className="h-2" style={{ backgroundColor: project.color }} />
          <CardContent className="flex h-full flex-col justify-between p-5 gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <ProjectIcon
                    className="h-7 w-7"
                    style={{ color: project.color }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold font-inter text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {project._count?.tasks || 0} tasks
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-all border-muted group/btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`/projects/${project.id}/settings`}
                      className=" text-center"
                    >
                      <Settings className="h-4 w-4 text-slate-400 group-hover/btn:text-accent-foreground transition-all" />
                    </Link>
                  </Button>
                </DropdownMenuTrigger>
                {/* <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href={`/projects/${project.id}`} className="w-full">
                      View Project
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent> */}
              </DropdownMenu>
            </div>

            {project.description ? (
              <p className="text-sm min-h-[40px] font-sofia text-slate-600 line-clamp-2 align-top">
                {project.description}
              </p>
            ) : (
              <p className="text-sm min-h-[40px] font-sofia text-slate-400 italic">
                No description provided.
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.owner && (
                  <Avatar
                    key={project.owner.id}
                    className="border-2 border-white h-7 w-7"
                  >
                    <AvatarImage src={project.owner.avatarUrl || undefined} />
                    <AvatarFallback className="text-xs bg-slate-200">
                      {project.owner.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                {project._count?.members && project._count.members > 4 && (
                  <div className="h-7 w-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-600">
                    +{project._count.members - 4}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
