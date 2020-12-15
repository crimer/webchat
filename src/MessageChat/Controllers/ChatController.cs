using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using MessageChat.ApiHelpers;
using MessageChat.Dto.Chat;
using MessageChat.Dto.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using static ApplicationCore.Entities.MemberStatuses;
using static ApplicationCore.Entities.UserRoles;

namespace MessageChat.Controllers
{
    [Authorize]
    [Route("chat")]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;
        private readonly IChatService _chatService;
        private readonly IUserRepository _userRepository;
        public ChatController(IChatRepository chatRepository, IChatService chatService, IUserRepository userRepository)
        {
            _chatRepository = chatRepository;
            _chatService = chatService;
            _userRepository = userRepository;
        }

        [HttpGet("getChatsByUserId/{userId}")]
        public async Task<ApiResponse> GetChatsByUserId(int userId)
        {
            if (userId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно получить чаты такого пользователя");

            var userChats = await _chatRepository.GetAllChatsByUserIdAsync(userId);
            IEnumerable<UserChatDto> data = userChats.Select(chat => new UserChatDto()
            {
                Id = chat.Id,
                ChatType = chat.ChatType,
                Name = chat.Name,
            });
            return new ApiResponse<IEnumerable<UserChatDto>>(data, (int)HttpStatusCode.OK);
        }

        [HttpGet("getChatsToReturnByUserId/{userId}")]
        public async Task<ApiResponse> GetChatsToReturnByUserId(int userId)
        {
            if (userId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно получить чаты такого пользователя");

            var userChats = await _chatRepository.GetChatsToReturnByUserIdAsync(userId);
            IEnumerable<ChatDto> data = userChats.Select(chat => new ChatDto()
            {
                Id = chat.Id,
                ChatType = chat.ChatType,
                Name = chat.Name,
            });
            return new ApiResponse<IEnumerable<ChatDto>>(data, (int)HttpStatusCode.OK);
        }

        [HttpGet("detailChatInfo/{chatId}")]
        public async Task<ApiResponse> GetDetailChatInfo(int chatId)
        {
            if (chatId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно получить информацию о чате");

            var userCookiesJson = HttpContext.Request.Cookies["userData"];
            AuthUserDto userCookiesData = JsonConvert.DeserializeObject<AuthUserDto>(userCookiesJson);

            var chatMember = await _userRepository.GetChatMemberAsync(chatId, userCookiesData.Id);

            if (chatMember == null)
                return new ApiResponse((int)HttpStatusCode.NotFound, "Вы не зарегистрированны");

            if (chatMember.MemberStatusId != 1)
                return new ApiResponse((int)HttpStatusCode.NotFound, "Вас нет в этом чате");

            Chat chatDetail = await _chatRepository.GetChatAsync(chatId);
            IEnumerable<ChatMember> members = await _chatRepository.GetChatMembersAsync(chatId);
            var chatMembers = members.Select(member => new UserChatDto()
            {
                Id = member.Id,
                Name = member.Login,
                UserRoleId = member.UserRoleId
            });

            ChatDetailDto detailDto = new ChatDetailDto()
            {
                Id = chatDetail.Id,
                Name = chatDetail.Name,
                ChatType = chatDetail.ChatType,
                Members = chatMembers
            };
            return new ApiResponse<ChatDetailDto>(detailDto, (int)HttpStatusCode.OK);
        }

        [HttpPost("createNewChat")]
        public async Task<ApiResponse> CreateNewChat([FromBody] CreateChatDto createChatDto)
        {
            if (createChatDto == null) return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно создать чат");

            bool creationSuccess = await _chatService.CreateNewChatAsync(createChatDto.ChatName, createChatDto.ChatTypeId, createChatDto.UserCreatorId);

            if (creationSuccess)
                return new ApiResponse((int)HttpStatusCode.OK);
            else
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Не удалось создать чат");
        }

        [HttpPost("createDirectChat")]
        public async Task<ApiResponse> CreateDirectChat([FromBody] CreateDirectChatDto createDirectChatDto)
        {
            if (createDirectChatDto == null || createDirectChatDto.MemberId <= 0 || createDirectChatDto.UserId <= 0)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно создать чат");
            
            if (createDirectChatDto.MemberId == createDirectChatDto.UserId)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Невозможно создать чат самим собой");

            IEnumerable<DirectChat> userDirectChats = await _chatRepository.GetUserDirectChats(createDirectChatDto.UserId);
            bool hasDirect = userDirectChats.Select(chat => chat.WithUserId).Contains(createDirectChatDto.MemberId);
            
            if(hasDirect) return new ApiResponse((int)HttpStatusCode.BadRequest, "Чат с этим пользователем уже есть");
            
            int createdDirectId = await _chatService.CreateDirectChatAsync(createDirectChatDto.UserId, createDirectChatDto.MemberId);

            return new ApiResponse<object>(new { ChatId = createdDirectId }, (int)HttpStatusCode.OK);
        }

        [HttpPost("inviteMembersToChat")]
        public async Task<ApiResponse> InviteMembers([FromBody] InviteUsersDto inviteUsersDto)
        {
            if (inviteUsersDto == null || inviteUsersDto.ChatId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");
            if (inviteUsersDto.UserIds.Count() == 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Некого приглашать в чат");

            await _chatService.InviteMembersToChatAsync(inviteUsersDto.ChatId, inviteUsersDto.UserIds);

            return new ApiResponse((int)HttpStatusCode.OK);
        }
        
        [HttpPost("returnToChat")]
        public async Task<ApiResponse> ReturnToChat([FromBody] ReturnToChatDto returnToChatDto)
        {
            if (returnToChatDto == null || returnToChatDto.ChatId <= 0 || returnToChatDto.UserId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");

            bool isSuccessReturn = await _chatService.BackToChatAsync(returnToChatDto.ChatId, returnToChatDto.UserId);
            if(isSuccessReturn)
                return new ApiResponse((int)HttpStatusCode.OK);
            else
                return new ApiResponse((int)HttpStatusCode.BadRequest);
        }

        [HttpPost("changeChatName")]
        public async Task<ApiResponse> ChangeChatName([FromBody] ChangeChatNameDto changeChatNameDto)
        {
            if (changeChatNameDto == null || changeChatNameDto.ChatId <= 0 || changeChatNameDto.UserId <= 0) return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");
            if (string.IsNullOrWhiteSpace(changeChatNameDto.NewName)) return new ApiResponse((int)HttpStatusCode.BadRequest, "Новое название не должно быть пустым");

            ChatMember user = await _userRepository.GetChatMemberAsync(changeChatNameDto.ChatId, changeChatNameDto.UserId);

            if((UserRole)user.UserRoleId == UserRole.Administrator && (MemberStatus)user.MemberStatusId == MemberStatus.InChat)
                await _chatService.ChangeChatNameAsync(changeChatNameDto.ChatId, changeChatNameDto.NewName);
            else 
                return new ApiResponse((int)HttpStatusCode.BadRequest, "У вас нет прав изменить название чата");

            return new ApiResponse((int)HttpStatusCode.OK);
        }
        
        [HttpPost("changeMemberRole")]
        public async Task<ApiResponse> ChangeMemberRole([FromBody] ChangeUserRoleDto changeUserRoleDto)
        {
            if (changeUserRoleDto == null || changeUserRoleDto.ChatId <= 0 
                || changeUserRoleDto.UserId <= 0 || changeUserRoleDto.UserRoleId <= 0)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");

            ChatMember user = await _userRepository.GetChatMemberAsync(changeUserRoleDto.ChatId, changeUserRoleDto.UserId);

            if(user.UserRoleId == changeUserRoleDto.UserRoleId)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "У этого пользователя и так установлена эта роль");
            else 
                await _chatService.ChangeUserRoleAsync(changeUserRoleDto.ChatId, changeUserRoleDto.UserId, changeUserRoleDto.UserRoleId);

            return new ApiResponse((int)HttpStatusCode.OK);
        }
        
        [HttpPost("leaveChat")]
        public async Task<ApiResponse> UserLaveChat([FromBody] UserLeaveChatDto userLeaveChatDto)
        {
            if (userLeaveChatDto == null || userLeaveChatDto.ChatId <= 0 || userLeaveChatDto.UserId <= 0)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");

            await _chatRepository.ChangeMemberStatusInChatAsync(userLeaveChatDto.ChatId, userLeaveChatDto.UserId, 2);

            return new ApiResponse((int)HttpStatusCode.OK);
        }

        [HttpPost("kikUserFromChat")]
        public async Task<ApiResponse> KikUserFromChat([FromBody] UserLeaveChatDto userLeaveChatDto)
        {
            if (userLeaveChatDto == null || userLeaveChatDto.ChatId <= 0 || userLeaveChatDto.UserId <= 0)
                return new ApiResponse((int)HttpStatusCode.BadRequest, "Что-то пошло не так");

            await _chatRepository.ChangeMemberStatusInChatAsync(userLeaveChatDto.ChatId, userLeaveChatDto.UserId, 3);

            return new ApiResponse((int)HttpStatusCode.OK);
        }
    }
}
