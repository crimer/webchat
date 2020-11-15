namespace ApplicationCore.Interfaces
{
    public interface IChatService
    {
        void CreateNewGroup(string name, string chatType, string avatarPath);
        void DeleteGroup(int chatId);
    }
}
