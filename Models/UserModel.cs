using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace MyNdMap.Models
{
    public class User
    {
        [Key]
        public int UserId {get;set;}        
        
        public string Name {get;set;}

        List<File> Files {get;set;}
    }
}