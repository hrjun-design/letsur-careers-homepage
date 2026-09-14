import { RefCollectionManager } from "@/components/admin/ref-collection-manager";

export default function AdminJobGroupsPage() {
  return <RefCollectionManager table="job_groups" label="직군" />;
}
