"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "./profile-settings";
import { ReceptionistSettings } from "./receptionist-settings";
import { KnowledgeBaseSettings } from "./knowledge-base-settings";
import { IntegrationSettings } from "./integration-settings";

export function SettingsTabs({ user, profile, receptionistConfig }: any) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="receptionist">Receptionist</TabsTrigger>
        <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4">
        <ProfileSettings user={user} profile={profile} />
      </TabsContent>

      <TabsContent value="receptionist" className="space-y-4">
        <ReceptionistSettings
          receptionistConfig={receptionistConfig}
          userId={user.id}
        />
      </TabsContent>

      <TabsContent value="knowledge" className="space-y-4">
        <KnowledgeBaseSettings userId={user.id} />
      </TabsContent>

      <TabsContent value="integrations" className="space-y-4">
        <IntegrationSettings receptionistConfig={receptionistConfig} />
      </TabsContent>
    </Tabs>
  );
}
