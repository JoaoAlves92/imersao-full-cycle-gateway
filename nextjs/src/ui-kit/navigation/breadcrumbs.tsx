import {
  Link as MuiLink,
  LinkProps as MuiLinkProps,
  Breadcrumbs as MuiBreadcrumbs,
} from "@mui/material";
import Link from "next/link";
import React from "react";

type Crumb = {
  label: string;
  href: string;
} & MuiLinkProps;

type BreadcrumbsProps = {
  crumbs: Crumb[];
};

const BreadCrumbs = ({ crumbs }: BreadcrumbsProps) => {
  return (
    <MuiBreadcrumbs>
      {crumbs.map((crumb, index) => (
        <MuiLink key={index} component={Link} {...crumb}>
          {crumb.label}
        </MuiLink>
      ))}
    </MuiBreadcrumbs>
  );
};

export { BreadCrumbs };
